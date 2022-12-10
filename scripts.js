import data from './data.json' assert {type: 'json'}
// console.log(data)

function getTr(){
    let e = document.createElement("tr")
    for(let i = 0; i < document.querySelector("thead > tr").children.length; i++){
        e.appendChild(document.createElement("td"))
    }
    return e
}

let sortStack = Array()

window.onload = () => {
    let b = document.querySelector("tbody")
    // console.log(data)
    // console.log(data.length)
    for(let i = 0; i < data.length; i++){
        let row = getTr()
        row.querySelector(":nth-child(1)").append(data[i].name)
        row.querySelector(":nth-child(2)").append("EP: "+data[i].ep+", S:"+data[i].s)
        row.querySelector(":nth-child(3)").append(data[i].ep_left)
        row.querySelector(":nth-child(4)").append(data[i].rating)
        row.setAttribute("name", data[i].name)
        row.setAttribute("ep", data[i].ep)
        row.setAttribute("s", data[i].s)
        b.appendChild(row)
    }
    
    document.querySelectorAll(".table-sortable th").forEach(headerCell => {
        headerCell.setAttribute("sortState", 0)
    	headerCell.addEventListener("click", () => {
    		const tableElement = headerCell.parentElement.parentElement.parentElement;
    		const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);

            headerCell.setAttribute("sortState", (headerCell.getAttribute("sortState")+1)%3)
            if(window.event.shiftKey){
                if (sortStack.length > 1) {
                    for (let i = 0; i < sortStack.length; i++){
                        if (sortStack[i] == headerIndex){
                            sortStack.splice(i,i)
                        }
                    }
                } else {
                    if (sortStack[0] == headerIndex){
                        sortStack = []
                    }
                }
                if (headerCell.getAttribute("sortState") > 0){
                    sortStack.push(headerIndex)
                }
            } else {
                if (headerCell.getAttribute("sortState") > 0){
                    sortStack = [headerIndex]
                } else {
                    sortStack = []
                }
            }
            console.log(sortStack)
    		sortTableByColumn(tableElement);
    	});
    });
}

function getTextFromRow(e, i){
    return e.querySelector(`td:nth-child(${i + 1})`).textContent.trim()
}

function compare(a, b){
    return (a > b) * 2 + (a === b) - 1
}

let gt = [
    (a,b) => compare(getTextFromRow(a, 0), getTextFromRow(b, 0)),
    (a,b) => compare(+a.getAttribute("ep"), +b.getAttribute("ep")),
    (a,b) => compare(+getTextFromRow(a, 2), +getTextFromRow(b, 2)),
    (a,b) => compare(+getTextFromRow(a, 3), +getTextFromRow(b, 3))
]

function sortTableByColumn(table) {
	const tBody = table.tBodies[0];
	const rows = Array.from(tBody.querySelectorAll("tr"));

	// Sort each row
	const sortedRows = rows.sort((a, b) => {
        let res = 0;
        for (let i of sortStack){
            if (gt[i](a, b) !== 0) {
                res = gt[i](a, b) * (table.querySelector(`th:nth-child(${i + 1})`).getAttribute("sortState")-1.5)*2
                break
            }
        }
		return res
	});

	// Remove all existing TRs from the table
	while (tBody.firstChild) {
		tBody.removeChild(tBody.firstChild);
	}

	// Re-add the newly sorted rows
	tBody.append(...sortedRows);

	// Remember how the column is currently sorted
	table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));

    for (let i of sortStack){
	    let j = table.querySelector(`th:nth-child(${i + 1})`)
        if (j.getAttribute("sortState") == 1) {
            j.classList.toggle("th-sort-desc", true)
        } else {
            j.classList.toggle("th-sort-asc", true)
        }
    }
}
