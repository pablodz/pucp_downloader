/**
 * moodleDownloader - a chrome extension for batch downloading Moodle resources 💾
 * Copyright (c) 2018 Harsil Patel
 * https://github.com/harsilspatel/MoodleDownloader
 */

function getDownloadOptions(sesskey, url) {
	if (!url.includes("folder")) {
		// Resources, URLs, Pages.
		// URLs and Pages need to be handled in popup.js.
		return {
			url: url + "&redirect=1"
		};
	}
	const urlObj = new URL(url);
	const id = urlObj.searchParams.get("id");
	// We will modify the downloadURL such that each folder has a
	// unique download URL (so suggestFilename will work).
	// Adding "?id=ID" to the POST URL still results in a valid
	// request, so we can use this to uniquely identify downloads.
	const downloadUrl =
		urlObj.origin +
		urlObj.pathname.slice(undefined, urlObj.pathname.lastIndexOf("/")) +
		"/download_folder.php?id=" +
		id;
	return {
		url: downloadUrl,
		method: "POST",
		headers: [
			{
				name: "content-type",
				value: "application/x-www-form-urlencoded"
			}
		],
		body: `id=${id}&sesskey=${sesskey}`
	};
}

var SUPPORTED_FILES = new Set(["File", "Folder", "URL", "Page"]);

function getFilesUnderSection(sesskey) {
	return Array.from(document.getElementsByClassName("content"))
		.map(content => {
			const sectionEl = content.querySelector("h3.sectionname");
			if (!sectionEl) return [];
			const section = sectionEl.textContent.trim();
			return Array.from(content.getElementsByClassName("activity"))
				.map(activity => ({
					instanceName: activity.getElementsByClassName(
						"instancename"
					)[0],
					archorTag: activity.getElementsByTagName("a")[0]
				}))
				.filter(
					({ instanceName, archorTag }) =>
						instanceName !== undefined && archorTag !== undefined
				)
				.map(({ instanceName, archorTag }) => ({
					name: instanceName.firstChild.textContent.trim(),
					downloadOptions: getDownloadOptions(
						sesskey,
						archorTag.href
					),
					type: instanceName.lastChild.textContent.trim(),
					section: section
				}))
				.filter(activity => SUPPORTED_FILES.has(activity.type));
		})
		.reduce((x, y) => x.concat(y), []);
}

function getFilesUnderResources(sesskey, tableBody) {
	return Array.from(tableBody.children) // to get files under Resources tab
		.filter(resource => resource.getElementsByTagName("img").length != 0)
		.map(
			resource =>
				(resource = {
					name: resource
						.getElementsByTagName("a")[0]
						.textContent.trim(),
					downloadOptions: getDownloadOptions(
						sesskey,
						resource.getElementsByTagName("a")[0].href
					),
					type: resource.getElementsByTagName("img")[0]["alt"].trim(),
					section: resource
						.getElementsByTagName("td")[0]
						.textContent.trim()
				})
		)
		.map((resource, index, array) => {
			resource.section =
				resource.section ||
				(array[index - 1] && array[index - 1].section) ||
				"";
			return resource;
		})
		.filter(resource => SUPPORTED_FILES.has(resource.type));
}

function getFiles() {
	open_folders2();
    xd();
}

getFiles();



function download_string(link) {
    sleep(600);
    (window.parent.location = link);
}

function xd() {
    var iframe = document.getElementById('frame_mid');
    var innerDoc2 = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
    var elements = innerDoc2.getElementsByClassName("mArchD");
    for (var i = 0; i < elements.length; i++) {
        number = elements[i].pathname.substr(7, 8);

        //var session = document.busqDocumentos.session.value;

        download_string(
            "/pucp/document/dowdocum/dowdocum;jsessionid=" +
            randomIntFromInterval(0,1000000) +
            "?accion=Descargar&documento=" +
            number
        );
        console.log(
            "/pucp/document/dowdocum/dowdocum;jsessionid=" +
            randomIntFromInterval(0,1000000)  +
            "?accion=Descargar&documento=" +
            number
        );
    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > milliseconds) {
            break;
        }
    }
}


function open_folders2() {

    var iframe = document.getElementById('frame_mid');
    var innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
    var elements2 = innerDoc.getElementsByTagName('a');
    for (var i = 0; i < elements2.length; i++) {
        try {
            if(elements2[i].id==""){
                elements2[i].onclick();
            }
            
        } catch (e) {
            console.log(e);
        }

    }
    sleep(1000);
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

