interface Transaction {
    category: string;
    description: string;
    tags: string[];
    amount: number;
    date: Date;
}

function description(a: Transaction) {
    return smallDate(a.date) + " " + a.category + "(" + a.description + "): " + (a.amount/100);
}

function amountToNumber(amount: string): number {
    var comps = amount.split(" ");
    if (comps.length != 2) throw amount + " is not a currency";
    comps = comps[1].split(",");
    if (comps.length != 2) throw amount + " is not a currency";
    return parseInt(comps[0]) * 100 + parseInt(comps[1]);
}

let months = {
    Jan: 0,
    Fev: 1,
    Mar: 2,
    Abr: 3,
    Mai: 4,
    Jun: 5,
    Jul: 6,
    Ago: 7,
    Set: 8,
    Out: 9,
    Nov: 10,
    Dez: 11
}
function dateStrToDate(str: string): Date {
    var comps = str.split("/");
    if (comps.length != 3) throw "Invalid date " + str;
    return new Date(parseInt(comps[2]), months[comps[1]], parseInt(comps[0]));
}
function smallDate(a: Date) {
    var month: string;
    for(var i in months) {
        if(months[i] == a.getMonth()) {
            month = i;
        }
    }

    return a.getUTCDate() + " " + month.toLocaleUpperCase() + " " + a.getUTCFullYear();
}

declare function $$(selector: string, child?: HTMLElement): HTMLElement[];

function transactionDivToTransaction(div: HTMLDivElement): Transaction {
    return {
        category: $$("span.title", div)[0].textContent,
        description: $$(".description", div)[0].textContent,
        tags: $$("span.tag", div).map(a => a.textContent),
        amount: amountToNumber($$("div.amount", div)[0].textContent),
        date: dateStrToDate($$("td.dc-table-label", div.parentElement.parentElement.parentElement)[0].textContent)
    }
}

function listPurchases(): Transaction[] {
    let table = $$("#feedTable")[0] as HTMLTableElement;
    let transactions = $$("tr.dc-table-row div.transaction", table) as HTMLDivElement[];
    return transactions.map(transactionDivToTransaction);
}

function sumAmount(a: Transaction[]): number {
    var r = 0;
    for(var i of a.map(a => a.amount)) {
        r += i;
    }
    return r;
}