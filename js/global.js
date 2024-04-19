const inputs = document.getElementsByTagName('input');
const textArea = document.getElementsByTagName('textarea');

for (let i = 0; i < inputs.length; i++) {
    inputs[i].onkeydown = function (event) {
        document.getElementById(getErrorId(inputs[i].id)).innerText = ''
        document.getElementById("loginFormError").innerText = ''
        document.getElementById("signUpFormError").innerText = ''
    }
}

for (let j = 0; j < textArea.length; j++) {
    textArea[j].onkeydown = function (event) {
        document.getElementById(getErrorId(textArea[j].id)).innerText = ''
    };
}

function getErrorId(inputId) {
        return inputId + "Error";
}


async function getPostServerResponse(apiLink, postData) {
    const serverLink = "http://localhost:9090";
    const res = await fetch(`${serverLink}${apiLink}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData),
    });
    if (!res.ok) {
        return false;
    }
    return await res.json();
}