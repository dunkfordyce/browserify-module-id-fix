var transform_tools = require('browserify-transform-tools'),
    path = require('path');

var cwd = process.cwd();

module.exports = transform_tools.makeRequireTransform('module-id-fix', {
    evaluateArguments: false
}, function(args, opts, done) { 
    var r,
        arg = args[0];

    if( (arg[0] != '"' && arg[0] != "'") || arg.indexOf('+') !== -1 ) { 
        try { 
            var other = opts.file.replace(cwd, '').replace('.js', '').substr(1);

            r = Function('module', 'return '+arg).call(null, {id: other});

            r = path.relative(path.dirname(other), r);
            if( r[0] != '.' ) { 
                r = './'+r;
            }
            r = '"'+r+'"';
        } catch(e) { 
            console.warn('failed computed', e);
            r = arg;
        }
    } else { 
        r = arg;
    }

    done(null, 'require('+r+')');
});
