"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacingsProcessor = void 0;
const baseProcessor_1 = require("./baseProcessor");
class SpacingsProcessor extends baseProcessor_1.BaseProcessor {
    schema;
    default;
    constructor(schema) {
        super();
        this.schema = schema;
        const defaults = 'default' in this.schema.spacings ? this.schema.spacings.default : {};
        const defaultEnd = this.findEnd(defaults);
        this.default = { spacing: defaults, end: defaultEnd };
        let spacingsFile = '';
        for (const spacingName of Object.keys(this.schema.spacings)) {
            if (spacingName === 'default')
                continue;
            const spacing = this.schema.spacings[spacingName];
            let s = `\n\n\n// Spacing - ${spacingName}\n`;
            const start = 1;
            let end;
            try {
                end = this.findEnd(spacing);
            }
            catch {
                end = defaultEnd;
            }
            s += ':root {\n';
            s += this.generateSpacingVars(spacingName, spacing, start, end);
            s += '}\n\n';
            s += this.generateSpacingRules(spacingName, spacing, start, end);
            spacingsFile += s;
        }
        this._content = spacingsFile;
        this.formatDocument();
    }
    generateSpacingRules(name, spacing, start, end) {
        let s = '';
        const short = spacing.short ?? name;
        for (let i = start; i <= end; i++) {
            let value = spacing[i];
            if (!value)
                value = this.default.spacing[i];
            if (!value)
                continue;
            s += `.${short}-${i} {${name}: ${value};}\n`;
            if (spacing.xy) {
                s += `.${short}x-${i} {
        ${name}-left: ${value};
        ${name}-right: ${value};
      }\n`;
                s += `.${short}y-${i} {
        ${name}-top: ${value};
        ${name}-bottom: ${value};
      }\n`;
                s += `.${short}t-${i} {${name}-top: ${value}; }\n`;
                s += `.${short}b-${i} { ${name}-bottom: ${value}; }\n`;
                s += `.${short}l-${i} { ${name}-left: ${value}; }\n`;
                s += `.${short}r-${i} { ${name}-right: ${value}; }\n`;
            }
            s += '\n';
        }
        return s;
    }
    generateSpacingVars(name, spacing, start, end) {
        const short = spacing.short ?? name;
        let s = '';
        for (let i = start; i <= end; i++) {
            let value = spacing[i];
            if (!value)
                value = this.default.spacing[i];
            if (!value)
                continue;
            s += `--${name}-${i}: ${value};\n`;
            if (short !== name)
                s += `--${short}-${i}: ${value};\n\n`;
        }
        return s;
    }
    findEnd(spacing, start = 1) {
        const end = Object.keys(spacing).reduce((acc, key) => {
            const num = parseInt(key);
            if (isNaN(num))
                return acc;
            return num > acc ? num : acc;
        }, 0);
        if (!end)
            throw new Error('No numeric keys');
        return end > start ? end : start;
    }
}
exports.SpacingsProcessor = SpacingsProcessor;
//# sourceMappingURL=spacings.js.map