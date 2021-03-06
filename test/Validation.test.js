var config = require("./fixtures/simple-config/webpack.config");
var OptionsValidationError = require("../lib/OptionsValidationError");
var Server = require("../lib/Server");
var webpack = require("webpack");

describe("Validation", function() {
	var compiler;
	before(function() {
		compiler = webpack(config);
	});
	var testCases = [{
		name: "invalid `hot` configuration",
		config: { hot: "asdf" },
		message: [
			" - configuration.hot should be a boolean."
		]
	}, {
		name: "invalid `public` configuration",
		config: { public: 1 },
		message: [
			" - configuration.public should be a string."
		]
	}, {
		name: "invalid `contentBase` configuration",
		config: { contentBase: [0] },
		message: [
			" - configuration.contentBase[0] should be a string.",
			" - configuration.contentBase should be one of these:",
			"   [string] | false | number | string",
			"   A directory to serve files non-webpack files from."
		]
	}, {
		name: "non-existing key configuration",
		config: { asdf: true },
		message: [
			" - configuration has an unknown property 'asdf'. These properties are valid:",
			"   object { hot?, hotOnly?, lazy?, host?, filename?, publicPath?, port?, socket?, " +
			"watchOptions?, headers?, clientLogLevel?, key?, cert?, ca?, pfx?, pfxPassphrase?, " +
			"inline?, public?, https?, contentBase?, watchContentBase?, open?, features?, " +
			"compress?, proxy?, historyApiFallback?, staticOptions?, setup?, stats?, reporter?, " +
			"noInfo?, quiet?, serverSideRender?, index?, log?, warn? }"
		]
	}];
	testCases.forEach(function(testCase) {
		it("should fail validation for " + testCase.name, function() {
			try {
				new Server(compiler, testCase.config);
			} catch(e) {
				if(!(e instanceof OptionsValidationError))
					throw e;
				e.message.should.startWith("Invalid configuration object.");
				e.message.split("\n").slice(1).should.be.eql(testCase.message);
				return;
			}
			throw new Error("Validation didn't fail");
		})
	});
});
