const curURL = window.location.href
const quizBox = document.getElementById('quiz-box')
const scoreBox = document.getElementById('score-box')
const resultBox = document.getElementById('result-box-card')
const timerBox = document.getElementById('timer-box')

const timer = (time)=>{
    let showSec
    let showMin

    timerBox.innerHTML =`Осталось:<b> ${time}:00</b>`


    let min = time - 1
    let sec = 60

    const counter = setInterval(()=>{
        sec--
        if (sec < 0){
            sec = 59
            min--
        }
        if (sec.toString().length < 2){
            showSec ='0'+sec
        }
        else{
            showSec = sec
        }
        showMin = min

        if (min === 0 && sec === 0){
            timerBox.innerHTML =`Осталось:<b> 0:00</b>`
            clearInterval(timer)
            alert('Время вышло!')
            sendData()
        }

        timerBox.innerHTML =`Осталось:<b>  ${showMin}:${showSec}</b>`

    }, 1000)

}

$.ajax({
    type: 'GET',
    url: `${curURL}data`,
    success: function(response){
        const data = response.Вопросы
        data.forEach(element => {
            for(const [question, answers] of Object.entries(element)){
                quizBox.innerHTML += `
                    <hr>
                    <div class="mb-2">
                        <h4>${question}</h4>
                    </div>
                `
                answers.forEach(answer=>{
                    quizBox.innerHTML +=`
                        <div>
                            <input type="radio" class="answer form-check-input" id="${question}-${answer}" name="${question}" value="${answer}">
                            <label for="${question}">${answer}</label>
                        </div>
                    `
                })
            }
                
        })
        timer(response.Время)
    },
    error: function(error){
        console.log(error)
    }
})

const quizForm = document.getElementById("quiz-form")
const csrf = document.getElementsByName("csrfmiddlewaretoken")




const sendData = ()=> {
    const elements = [...document.getElementsByClassName("answer form-check-input")]
    const data = {}
    data['csrfmiddlewaretoken'] = csrf[0].value
    elements.forEach(element=>{
        if (element.checked){
            data[element.name] = element.value
        } 
        else {
            if (!data[element.name]){
                data[element.name] = null
            }
        }
    })

    $.ajax({
        type: 'POST',
        url:`${curURL}save/`,
        data: data,
        success: function(response){
            const results = response.результат
            console.log(results)
            quizForm.classList.add('not-visible')

            scoreBox.innerHTML = `${response.пройден ? 'Поздравляем!' : 'Ой...'}Ваш результат: ${response.процент}%`

            results.forEach(res=>{
                const resultsDiv = document.createElement("div")
                for (const [question, choice] of Object.entries(res)){
                    console.log(question)
                    console.log(choice)
                    console.log('-------')
                    resultsDiv.innerHTML += question
                    const divClass = ['container', 'p-2', 'text-light', 'fw-bold', 'card', 'mx-auto', 'mt-3', 'mb-3']
                    resultsDiv.classList.add(...divClass)

                    if (choice == 'пропущен') {
                        resultsDiv.innerHTML += ' | пропущен'
                        resultsDiv.classList.add('bg-danger')
                    }
                    else{
                        const answer = choice['выбранный ответ']
                        const correct = choice['верный ответ']
                        resultsDiv.innerHTML += ` | выбран: ${answer} `

                        if (answer == correct){
                            resultsDiv.classList.add('bg-success')
                        }
                        else{
                            resultsDiv.innerHTML += `| правильный ответ: ${correct} `
                            resultsDiv.classList.add('bg-danger')
                        }
                    }
                }
                
                resultBox.append(resultsDiv)
            })

            document.getElementsByTagName("button")[0].style.display = 'none'
        },
        error: function(error){
            console.log(error)
        }
    })
}

quizForm.addEventListener('submit', element => {
    element.preventDefault()

    sendData()
})