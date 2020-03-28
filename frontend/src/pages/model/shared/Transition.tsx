export let isFormClosed: boolean = true;

export function formTransition() {
    changeCardsSize();
    openCloseForm();
    isFormClosed = !isFormClosed;
}

function openCloseForm() {
    if (isFormClosed) {
        document.getElementById("blockWithForm").classList.remove('disappearForm');
        document.getElementById("toggleFormButton").innerHTML = "Close Query";

        document.getElementById("blockWithForm").classList.remove('col-md-0');
        document.getElementById("blockWithForm").classList.add('col-md-4');

        document.getElementById("blockWithElse").classList.remove('col-md-11');
        document.getElementById("blockWithElse").classList.add('col-md-7');

    } else {
        document.getElementById("blockWithForm").classList.add('disappearForm');
        document.getElementById("toggleFormButton").innerHTML = "Open Query";

        document.getElementById("blockWithForm").classList.remove('col-md-4');
        document.getElementById("blockWithForm").classList.add('col-md-0');

        document.getElementById("blockWithElse").classList.remove('col-md-7');
        document.getElementById("blockWithElse").classList.add('col-md-11');
    }
}

export function changeCardsSize() {
    if (isFormClosed) {
        let elements: HTMLElement[] | any = document.getElementsByClassName("cardHolder");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove('col-sm-2');
            elements[i].classList.add('col-sm-3');
        }

    } else {
        let elements: HTMLElement[] | any = document.getElementsByClassName("cardHolder");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove('col-sm-3');
            elements[i].classList.add('col-sm-2');
        }
    }
}
