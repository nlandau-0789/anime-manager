import data from './data.json' assert {type: 'json'}
// console.log(data)

function getTr(){
    e = document.createElement("tr")
    for(let i = 0; i < document.querySelector("thead > tr").children.length; i++){
        e.appendChild(document.createElement("td"))
    }
    return e
}

window.onload = () => {
    let b = document.querySelector("tbody")
    for(let i = 0; i < data.length; i += 1){
        row = getTr()
    }
}