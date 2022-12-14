const modalBtns = [...document.getElementsByClassName('btn-outline-primary')]
const modalBody = document.getElementById('modal-body-confirm')
const startBtn = document.getElementById('start-button')
const curURL = window.location.href


console.log(modalBtns)

modalBtns.forEach(modalBtn=> modalBtn.addEventListener('click', ()=> {
                                                                        const pk = modalBtn.getAttribute('data-pk')
                                                                        const name = modalBtn.getAttribute('data-quiz')
                                                                        const questions_amount = modalBtn.getAttribute('data-questions')
                                                                        const time = modalBtn.getAttribute('data-time')
                                                                        const score_to_pass = modalBtn.getAttribute('data-score-to-pass')
                                                                        modalBody.innerHTML=`
                                                                            <h5>Начать <b>${name}?</b></h5>
                                                                            <div class="text-muted">
                                                                                <ul>
                                                                                    <li>Количество вопросов: <i>${questions_amount}</i></li>
                                                                                    <li>Отведенное время: <i>${time} мин</i></li>
                                                                                    <li>Порог прохождения: <i>${score_to_pass}%</i></li>
                                                                                </ul>
                                                                            </div>
                                                                        `
                                                                        startBtn.addEventListener('click', () => {
                                                                            console.log(curURL)
                                                                            window.location.href= curURL + "/"+pk
                                                                        })
                                                                    }))