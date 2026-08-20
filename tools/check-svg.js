#!/usr/bin/env node
// XML well-formedness check for the hand-authored SVG mockups.
//
// Replaces the old `python -c "...ET.parse..."` one-liner: this project has no
// build step and no dependencies, and the machines it is edited on have Node
// but not Python, so the check has to stand on its own.
//
//   node tools/check-svg.js                     # every SVG under assets/
//   node tools/check-svg.js path/to/one.svg     # just these

const fs = require('fs');
const path = require('path');

const VOID_OK = /^[A-Za-z_:][-A-Za-z0-9_:.]*$/;
const ENTITY = /^&(#[0-9]+|#[xX][0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/;

function lineAt(src, pos) {
    let line = 1;
    for (let i = 0; i < pos && i < src.length; i++) if (src[i] === '\n') line++;
    return line;
}

// Every bare '&' must open a real entity reference.
function checkText(src, from, to, errors) {
    for (let i = from; i < to; i++) {
        if (src[i] !== '&') continue;
        if (!ENTITY.test(src.slice(i, i + 12))) {
            errors.push('line ' + lineAt(src, i) + ': bare "&" that is not an entity reference');
        }
    }
}

// Attributes must be name="value" or name='value'. Unquoted or malformed fails.
function checkAttrs(src, tagStart, attrText, errors) {
    let i = 0;
    while (i < attrText.length) {
        if (/\s/.test(attrText[i])) { i++; continue; }
        const rest = attrText.slice(i);
        const m = rest.match(/^([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)')/);
        if (!m) {
            const junk = rest.split(/\s/)[0].slice(0, 40);
            errors.push('line ' + lineAt(src, tagStart) + ': malformed attribute near "' + junk + '"');
            return;
        }
        const value = m[3] !== undefined ? m[3] : m[4];
        checkText(value, 0, value.length, errors);
        i += m[0].length;
    }
}

function check(src, label) {
    const errors = [];
    const stack = [];
    let rootsClosed = 0;
    let i = 0;

    while (i < src.length) {
        const lt = src.indexOf('<', i);
        if (lt === -1) { checkText(src, i, src.length, errors); break; }
        checkText(src, i, lt, errors);

        const skip = (open, close, what) => {
            const end = src.indexOf(close, lt + open.length);
            if (end === -1) {
                errors.push('line ' + lineAt(src, lt) + ': unterminated ' + what);
                return -1;
            }
            return end + close.length;
        };

        if (src.startsWith('<!--', lt)) { const n = skip('<!--', '-->', 'comment'); if (n < 0) break; i = n; continue; }
        if (src.startsWith('<![CDATA[', lt)) { const n = skip('<![CDATA[', ']]>', 'CDATA section'); if (n < 0) break; i = n; continue; }
        if (src.startsWith('<?', lt)) { const n = skip('<?', '?>', 'processing instruction'); if (n < 0) break; i = n; continue; }
        if (src.startsWith('<!', lt)) { const n = skip('<!', '>', 'declaration'); if (n < 0) break; i = n; continue; }

        // Walk to the tag's '>', ignoring any that sit inside an attribute value.
        let j = lt + 1;
        let quote = null;
        for (; j < src.length; j++) {
            const c = src[j];
            if (quote) { if (c === quote) quote = null; }
            else if (c === '"' || c === "'") quote = c;
            else if (c === '>') break;
        }
        if (j >= src.length) {
            errors.push('line ' + lineAt(src, lt) + ': unterminated tag');
            break;
        }

        let raw = src.slice(lt + 1, j);
        const closing = raw[0] === '/';
        const selfClosing = !closing && raw.endsWith('/');
        if (closing) raw = raw.slice(1);
        if (selfClosing) raw = raw.slice(0, -1);

        const nameMatch = raw.match(/^\s*([^\s/>]+)/);
        const name = nameMatch ? nameMatch[1] : '';
        if (!VOID_OK.test(name)) {
            errors.push('line ' + lineAt(src, lt) + ': invalid element name "' + name + '"');
            i = j + 1;
            continue;
        }

        if (closing) {
            if (raw.slice(nameMatch[0].length).trim() !== '') {
                errors.push('line ' + lineAt(src, lt) + ': closing tag </' + name + '> has attributes');
            }
            const open = stack.pop();
            if (open === undefined) {
                errors.push('line ' + lineAt(src, lt) + ': closing </' + name + '> with nothing open');
            } else if (open.name !== name) {
                errors.push('line ' + lineAt(src, lt) + ': closing </' + name + '> but <' + open.name + '> is open (line ' + open.line + ')');
            } else if (stack.length === 0) {
                rootsClosed++;
            }
        } else {
            checkAttrs(src, lt, raw.slice(nameMatch[0].length), errors);
            if (stack.length === 0 && rootsClosed > 0) {
                errors.push('line ' + lineAt(src, lt) + ': second root element <' + name + '>');
            }
            if (selfClosing) {
                if (stack.length === 0) rootsClosed++;
            } else {
                stack.push({ name: name, line: lineAt(src, lt) });
            }
        }
        i = j + 1;
    }

    for (const open of stack) {
        errors.push('line ' + open.line + ': <' + open.name + '> is never closed');
    }
    if (rootsClosed === 0 && stack.length === 0) {
        errors.push('no root element found');
    }
    if (!/<svg[\s>]/.test(src)) {
        errors.push('no <svg> element found');
    }
    return errors;
}

const args = process.argv.slice(2);
const dir = path.resolve(__dirname, '..', 'assets', 'screenshots');
const files = args.length
    ? args
    : fs.readdirSync(dir).filter(f => f.endsWith('.svg')).map(f => path.join(dir, f));

let bad = 0;
for (const file of files) {
    const errors = check(fs.readFileSync(file, 'utf8'), file);
    if (errors.length) {
        bad++;
        console.error(path.relative(process.cwd(), file).split(path.sep).join('/'));
        for (const e of errors) console.error('  ' + e);
    }
}

if (bad) {
    console.error('\nsvg FAILED: ' + bad + ' of ' + files.length + ' file(s) malformed');
    process.exit(1);
}
console.log('svg ok (' + files.length + ' files)');
