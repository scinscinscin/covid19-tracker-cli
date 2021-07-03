const colorScheme: string = `{theme: {
	black: "#000000",
    red: "#cd3131",
    green: "#0dbc79",
    yellow: "#e5e510",
    blue: "#2472c8",
    magenta: "#bc3fbc",
    cyan: "#11a8cd",
    white: "#e5e5e5"
}}`;

/**
 *
 * @param data Data meant to be rendered to terminals
 * @returns Web safe version of the data using Xterm.js
 */
export const generateWebDashboard = (
    data: string,
    fontSize: number = 16
): string => {
    data = data.replace(/\n/g, "\\r\\n");
    let response = `<!doctype html>
	<html>
		<head>
		<meta charset="UTF-8">
		<meta name="title" content="COVID-19 Tracker CLI" />
		<meta name="description" content="Find information about Covid-19 in the browser and in your terminal" />
		<meta name="abstract" content="Find information about Covid-19 in the browser and in your terminal" />
		<meta name="keywords" content="covid19, covid, pandemic, virus, bat-soup" />
		<meta name="revisit-after" content="5 days">
		<meta name="language" content="EN-US" />
		<meta name="robots" content="index, follow">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="google" content="notranslate" />
		<meta name="google" content="nositelinkssearchbox" />
		<title>COVID-19 Tracker CLI</title>
		<script src="https://cdn.jsdelivr.net/npm/xterm@4.5.0/lib/xterm.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.3.0/lib/xterm-addon-fit.min.js"></script>
		<link href="https://pvinis.github.io/iosevka-webfont/3.4.1/iosevka.css" rel="stylesheet" />
		</head>
		<body>
		<div id="terminal" style='width: 100%;height: 100vh;padding-left: 2px'></div>
		</body>
		<script>
			var term = new Terminal(${colorScheme});
			term.setOption("fontSize", ${fontSize});
			term.setOption("fontFamily", "Iosevka Web");
			var fitAddon = new FitAddon.FitAddon()
			term.loadAddon(fitAddon);
			term.open(document.getElementById('terminal'));
			fitAddon.fit();
			term.write(\`${data}\`);
		</script>
		<style>
			body{
				background: #000; 
				margin:0;padding:0;
				overflow:hidden;
			}
			textarea, .xterm-char-measure-element, .xterm-scroll-area{
				display: none;
			}
		</style>
	</html>`;

    return response;
};
