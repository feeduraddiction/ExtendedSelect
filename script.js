const goodsList = document.querySelector(".goods-list-select");

class extendedSelector {

  #mainContainer = document.createElement("div");
  #checkBoxesOverlay = document.createElement("div");
  #checkBoxOverlay = document.createElement("div");
  #checkBoxDot = document.createElement("div");
  //checkBoxesOverlay is a solution for easy styling of the option.
  //Thus we do not have possibility to add all the required styles in <option> I decided to create my pseudo elements.
  #popUpWindow = document.createElement("div");
  #submitArea = document.createElement("div");
  #applyButton = document.createElement("button")
  #clearButton = document.createElement("button");
  #selectedOption = document.createElement("div");
  #selectedOptionText = document.createElement("div");
  #selectedOptionTitle = document.createElement("h5");
  #selectedOptionChosen = document.createElement("p");
  #selectedOptionWindow = document.createElement("input");
  #optionsArray = Array.from(goodsList.options)
  #outputArray = [];



  #setElementsClasses() {
    this.#mainContainer.className = "main-container";
    this.#checkBoxesOverlay.className = "checkboxes-overlay";
    this.#checkBoxOverlay.className = "checkbox-overlay";
    this.#checkBoxDot.className = "dot-checkbox";
    this.#popUpWindow.className = "pop-up-window";
    this.#popUpWindow.classList.add("visually-hidden");
    this.#submitArea.className = "submit-area";
    this.#applyButton.className = "apply-button";
    this.#clearButton.className = "clear-button";
    this.#selectedOption.className = "selected-option";
    this.#selectedOptionText.className = "selected-option__text";
    this.#selectedOptionTitle.className = "selected-option__title";
    this.#selectedOptionChosen.className = "selected-option__chosen";
    this.#selectedOptionWindow.className = "selected-option__window";
  }

  #setElementsInnerHTML() {
    this.#applyButton.innerHTML = "ПРИМЕНИТЬ";
    this.#clearButton.innerHTML = "Очистить";
    this.#selectedOptionTitle.innerHTML = "Тендеры в роли Заказчика";

  }
  #setElementsStyles() {
    this.#setElementsClasses();
    this.#setElementsInnerHTML();
    this.#selectedOptionWindow.setAttribute("type", "text");
    this.#selectedOptionWindow.setAttribute("placeholder", "Код ОКРБ или наименование закупаемой продукции");

  }

  #showChosenOption() {
    return Array.from(goodsList.options).filter(option => option.selected).length;
  }

  #createMultipleCheckboxes() {
    for (let i = 0; i < Array.from(goodsList.options).length; i++) {
      this.#checkBoxesOverlay.appendChild(this.#checkBoxOverlay.cloneNode(true)); //adding clones of div of checkboxes
    }
  }

  #createDottedCheckbox() {
    document.querySelectorAll(".checkbox-overlay").forEach((element, index) => {
      if ((index < 5 && index > 0) || (index < 15 && index > 10)) {
        element.appendChild(this.#checkBoxDot.cloneNode(true)); //adding dotted checkboxes like in Figma patter
      }
    });
  }

  #removeAllSelections() {
    this.#optionsArray.forEach((element) =>
      element.removeAttribute("selected")
    );
    document.querySelectorAll(".checkbox-overlay").forEach((element) => {
      element.classList.remove("checked-checkbox");
    });
    this.#selectedOptionChosen.innerHTML = `Показать выбранное(${this.#showChosenOption()})`;
  }


  #setSingleLineSize(checkBox, index) {
    checkBox.setAttribute("number", `${10 + index}`); // set attribute to checkboxes
    if (
      checkBox.getAttribute("number") === "10" || //all the single lines
      checkBox.getAttribute("number") === "14" ||
      checkBox.getAttribute("number") === "20" ||
      checkBox.getAttribute("number") === "24"
    ) {
      checkBox.classList.add("single-line-overlay"); //adding style with less margin
    }
  }

  #toggleSelection(checkBox, index) {
    Array.from(goodsList.options)[index].toggleAttribute("selected");
    checkBox.classList.toggle("checked-checkbox");
    checkBox.toggleAttribute;
    document
      .querySelector("#select")
      .dispatchEvent(new Event('change')) //dispatch event for <select>
  }

  #checkBoxProcess() {
    document
      .querySelectorAll(".checkbox-overlay")
      .forEach((checkBox, index) => {
        this.#setSingleLineSize(checkBox, index);
        checkBox.addEventListener("click", () => {
          this.#toggleSelection(checkBox, index)
          this.#selectedOptionChosen.innerHTML = `Показать выбранное(${this.#showChosenOption()})`;
          this.#selectedOptionWindow.value = this.#showCurrentOption();

        });
      });
  }

  #appendPopUpWindow() {
    document.body.appendChild(this.#popUpWindow);
    this.#popUpWindow.appendChild(this.#checkBoxesOverlay);
    this.#popUpWindow.appendChild(this.#mainContainer);
    this.#popUpWindow.appendChild(this.#submitArea);
    this.#submitArea.appendChild(this.#applyButton);
    this.#submitArea.appendChild(this.#clearButton);
  }

  #appendSelectedOption() {
    document.body.prepend(this.#selectedOption);
    this.#selectedOption.appendChild(this.#selectedOptionText);
    this.#selectedOptionText.append(this.#selectedOptionTitle);
    this.#selectedOptionText.append(this.#selectedOptionChosen);
    this.#selectedOption.appendChild(this.#selectedOptionWindow);
  }

  #selectChangeHandler(e) {
    console.log(e.target)
    console.log(e.target.value)
    // this.#outputArray.push(e.target.value)
    // console.log(e.target.value)
    // console.log(this.#outputArray)
  }

  #getSelectedOptions() {
    return this.#optionsArray.filter(element => { return element.selected })
  }

  #showCurrentOption() {
    let options = this.#getSelectedOptions();
    return options.length > 0 ? options.sort((a, b) => { return a.value - b.value })[0].text : '';
  }


  createAllElements(selectElement) {
    this.#setElementsStyles()

    document.body.appendChild(this.#mainContainer);
    this.#mainContainer.appendChild(selectElement);
    document.body.appendChild(this.#checkBoxesOverlay);

    this.#createMultipleCheckboxes();
    this.#createDottedCheckbox();
    this.#appendPopUpWindow();
    this.#checkBoxProcess();
    this.#appendSelectedOption();

    this.#clearButton.addEventListener("click", () => {
      this.#removeAllSelections()
    });

    this.#selectedOptionChosen.addEventListener("click", () => {
      this.#popUpWindow.classList.remove("visually-hidden")
    })

    this.#applyButton.addEventListener("click", () => {
      this.#popUpWindow.classList.add("visually-hidden")
    })

    this.#selectedOptionWindow.addEventListener("click", () => {
      this.#popUpWindow.classList.remove("visually-hidden")
    })

    selectElement.addEventListener("change",
      this.#selectChangeHandler.bind(this)
    );


  }

  setDefaultOption(optionValue) {
    const checkBoxes = document.querySelectorAll(".checkbox-overlay");
    this.#selectedOptionChosen.innerHTML = `Показать выбранное(${optionValue.length})`;
    for (let i = 0; i < optionValue.length; i++) {
      for (let j = 0; j < Array.from(goodsList.options).length; j++) {
        if (+optionValue[i] == Array.from(goodsList.options)[j].value) {
          Array.from(goodsList.options)[j].setAttribute("selected", "true");
          checkBoxes[j].classList.add("checked-checkbox");
        }
      }
    }
    this.#selectedOptionWindow.value = this.#showCurrentOption();

  }

}

const tenderSelect = new extendedSelector();
tenderSelect.createAllElements(goodsList);
tenderSelect.setDefaultOption([15, 20]);

