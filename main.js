
const subject = document.getElementById("subject");
const ques = document.getElementById("textarea");
const sub = document.getElementById("submit");
const show_response = document.getElementById("show-response");
const display_ques = document.getElementById("display-ques");
const search_input = document.getElementById("search");

const questionData = new Map();
const questionResponseCounts = new Map();

function renderQuestionList() {
    const searchTerm = search_input.value.toLowerCase().trim();
    
    let questions = Array.from(questionData.keys());

    const filteredQuestions = questions.filter(fullText => {
        return fullText.toLowerCase().includes(searchTerm);
    });

    filteredQuestions.sort((textA, textB) => {
        const countA = questionResponseCounts.get(textA) || 0;
        const countB = questionResponseCounts.get(textB) || 0;
        return countB - countA; 
    });

    display_ques.innerHTML = "";
    
    filteredQuestions.forEach(fullText => {
        
        const [subjectValue, questionValue] = fullText.split(/:\s*(.*)/s);

        const display_left = document.createElement("button");
        const line_break = document.createElement("br");

        display_left.innerText = fullText;
        display_left.setAttribute("data-subject", subjectValue);
        display_left.setAttribute("data-ques", questionValue);
        display_left.classList.add("display-right");

        display_ques.append(display_left, line_break);
    });
}

function fiterAndSortQuestion() {

    renderQuestionList();
}

search_input.addEventListener("input", fiterAndSortQuestion);

sub.addEventListener("click", () => {
    const subjectValue = subject.value.trim();
    const quesValue = ques.value.trim();

    if (subjectValue === "" || quesValue === "") {
        alert("Enter the fields first.");
        return;
    }

    const fullText = subjectValue + ": " + quesValue;

    if (!questionData.has(fullText)) {
        questionData.set(fullText, []); 
        questionResponseCounts.set(fullText, 0); 
    }

    
    subject.value = "";
    ques.value = "";
    
    renderQuestionList();
});


display_ques.addEventListener("click", (e) => {
    if (e.target.classList.contains("display-right")) {
        const fullquestext = e.target.innerText;
        const subjectAttr = e.target.getAttribute("data-subject");
        const questionAttr = e.target.getAttribute("data-ques");
        dis(fullquestext, subjectAttr, questionAttr); 
    }
});

function dis(fullquestext, subject, question) {
    show_response.innerHTML = "";

    const quescontainer = document.createElement("div");
    quescontainer.classList.add("ques-detail");

    quescontainer.innerHTML = `
        <h2>${subject}</h2>
        <p>${question}</p>
        <h3>Responses</h3>
        <div class="res-list">
        </div>
        <hr>
        <h4>Add your response</h4>
        <input type="text" placeholder="Name" id="responser-name">
        <br>
        <textarea rows="4" cols="50" placeholder="Answer here" id="response-text"></textarea>
        <br>
        <button class="add-response-btn">Submit Answer</button>
    `;
    show_response.appendChild(quescontainer);

    const responses = questionData.get(fullquestext) || [];
    renderResponses(quescontainer.querySelector(".res-list"), responses);

    const addresbtn = quescontainer.querySelector(".add-response-btn");
    addresbtn.addEventListener("click", () => {
        addresponse(quescontainer, fullquestext);
    });
}

function renderResponses(reslistElement, responses) {
    reslistElement.innerHTML = "";
    for (let i = responses.length - 1; i >= 0; i--) {
        const res = responses[i];
        const resdiv = document.createElement("div");
        resdiv.classList.add("single-respone");
        resdiv.innerHTML = `
            <p><strong>${res.text}</strong></p>
            <p>- Answered by: ${res.name}</p>
            <hr>
        `;
        reslistElement.appendChild(resdiv);
    }
}


function addresponse(quescontainer, fullquestext) {
    const resnameInput = quescontainer.querySelector("#responser-name");
    const restextInput = quescontainer.querySelector("#response-text");
    const reslist = quescontainer.querySelector(".res-list");

    const resname = resnameInput.value.trim();
    const restext = restextInput.value.trim();

    if (resname === "" || restext === "") {
        alert("Please enter both your name and your answer.");
        return;
    }

    const newResponse = { name: resname, text: restext };

    const responses = questionData.get(fullquestext);
    if (responses) {
        responses.push(newResponse);
        questionResponseCounts.set(fullquestext, responses.length);
    }
    
    renderResponses(reslist, responses);

    resnameInput.value = "";
    restextInput.value = "";
    
  renderQuestionList();
}