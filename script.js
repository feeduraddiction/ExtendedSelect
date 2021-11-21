const goodsListInput = document.querySelector(".goods-list-select");
// const goodsListInputTwo = document.querySelector(".goods-list-select-two");



class extendedSelector {
  #optionsArray
  constructor(goodsListed) {
    this.goodsList = goodsListed;
    this.#optionsArray = Array.from(goodsListed.options)
  }

  testMethod() {
    console.log(Array.from(this.goodsList.options))
    console.log(this.#optionsArray);
  }

  #mainContainer = document.createElement("div");
  #selectContainer = document.createElement("div");
  #checkBoxesOverlay = document.createElement("div");
  #checkBoxOverlay = document.createElement("div");
  #checkBoxDot = document.createElement("div");
  //checkBoxesOverlay is a solution for easy styling of the option.
  //Thus we do not have possibility to add all the required styles in <option> I decided to create my pseudo elements.
  // https://developer.mozilla.org/ru/docs/Web/HTML/Element/option
  #popUpWindow = document.createElement("div");
  #submitArea = document.createElement("div");
  #applyButton = document.createElement("button")
  #clearButton = document.createElement("button");
  #selectedOption = document.createElement("div");
  #selectedOptionText = document.createElement("div");
  #selectedOptionTitle = document.createElement("h5");
  #selectedOptionChosen = document.createElement("p");
  #selectedOptionWindow = document.createElement("input");
  #checkedOptionsLength = 0;



  #setElementsClasses() {
    this.#selectContainer.className = "select-container";
    this.#checkBoxesOverlay.className = "checkboxes-overlay";
    this.#checkBoxOverlay.className = `checkbox-overlay ${this.goodsList.name}-checkbox`;
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
    return this.#getSelectedOptions().length > 0 ?
      `Показать выбранное(${this.#optionsArray.filter(option => option.selected).length})` :
      ""

  }

  #createMultipleCheckboxes() {
    for (let i = 0; i < this.#optionsArray.length; i++) {
      this.#checkBoxesOverlay.appendChild(this.#checkBoxOverlay.cloneNode(true)); //adding clones of div of checkboxes
    }
  }

  #createDottedCheckbox() {
    document.querySelectorAll(`.${this.goodsList.name}-checkbox`).forEach((element, index) => {
      if ((index < 5 && index > 0) || (index < 15 && index > 10)) {
        element.appendChild(this.#checkBoxDot.cloneNode(true)); //adding dotted checkboxes like in Figma patter
      }
    });
  }

  #removeAllSelections() {
    this.#optionsArray.forEach((element) =>
      element.removeAttribute("selected")
    );
    document.querySelectorAll(`.${this.goodsList.name}-checkbox`).forEach((element) => {
      element.classList.remove("checked-checkbox");
    });
    this.#selectedOptionChosen.innerHTML = this.#showChosenOption();
    this.#selectedOptionWindow.value = '';
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
    this.#optionsArray[index].toggleAttribute("selected");
    checkBox.classList.toggle("checked-checkbox");
    //dispatch event for <select>
  }

  #checkBoxProcess() {
    document
      .querySelectorAll(`.${this.goodsList.name}-checkbox`)
      .forEach((checkBox, index) => {
        this.#setSingleLineSize(checkBox, index);
        checkBox.addEventListener("click", () => {
          this.#toggleSelection(checkBox, index)
          this.#selectedOptionChosen.innerHTML = this.#showChosenOption();
          this.#selectedOptionWindow.value = this.#showCurrentOption();
          this.goodsList.dispatchEvent(new Event('change'));
        });
      });
  }

  #appendPopUpWindow() {
    document.body.appendChild(this.#popUpWindow);
    this.#popUpWindow.appendChild(this.#checkBoxesOverlay);
    this.#popUpWindow.appendChild(this.#selectContainer);
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

  #mainContainerAppend() {
    this.#mainContainer.appendChild(this.#selectedOption);
    this.#mainContainer.appendChild(this.#popUpWindow);
  }

  #selectChangeHandler(e) {
    // console.log(e.target.value)
    this.#checkedOptionsLength = Array.from(e.target).filter(element => { return element.selected }).length; //return quantity
  }
  #getSelectedOptions() {
    return this.#optionsArray.filter(element => { return element.selected })
  }

  #showCurrentOption() {
    let options = this.#getSelectedOptions();
    return options.length > 0 ? options.sort((a, b) => { return a.dataset.level - b.dataset.level })[0].text : '';
  }


  createAllElements() {
    this.#setElementsStyles()
    document.body.appendChild(this.#selectContainer);
    this.#selectContainer.appendChild(this.goodsList);
    document.body.appendChild(this.#checkBoxesOverlay);
    document.body.appendChild(this.#mainContainer);

    this.#createMultipleCheckboxes();
    this.#createDottedCheckbox();
    this.#appendPopUpWindow();
    this.#checkBoxProcess();
    this.#appendSelectedOption();
    this.#mainContainerAppend()




    this.#clearButton.addEventListener("click", () => {
      this.#removeAllSelections()
      this.#checkedOptionsLength = 0;
    });

    this.#selectedOptionChosen.addEventListener("click", () => {
      this.#popUpWindow.classList.remove("visually-hidden")
    })

    this.#applyButton.addEventListener("click", () => {
      this.#popUpWindow.classList.add("visually-hidden")
      alert(`Кол-во выбранных элементов: ${this.#checkedOptionsLength}`);
    })

    this.#selectedOptionWindow.addEventListener("click", () => {
      this.#popUpWindow.classList.remove("visually-hidden")
    })

    this.goodsList.addEventListener("change",
      this.#selectChangeHandler.bind(this)
    );

  }

  setDefaultOption(optionValue) {
    const checkBoxes = document.querySelectorAll(`.${this.goodsList.name}-checkbox`);
    this.#selectedOptionChosen.innerHTML = `Показать выбранное(${optionValue.length})`;
    for (let i = 0; i < optionValue.length; i++) {
      for (let j = 0; j < this.#optionsArray.length; j++) {
        if (+optionValue[i] == this.#optionsArray[j].value) {
          this.#optionsArray[j].setAttribute("selected", "true");
          checkBoxes[j].classList.add("checked-checkbox");
        }
      }
    }
    this.#selectedOptionWindow.value = this.#showCurrentOption();
    this.#checkedOptionsLength = optionValue.length;

  }

}

const tenderSelect = new extendedSelector(goodsListInput);
tenderSelect.createAllElements();
tenderSelect.setDefaultOption([15, 20]);

// const tenderSelectTwo = new extendedSelector(goodsListInputTwo);
// tenderSelectTwo.createAllElements();
// tenderSelectTwo.setDefaultOption([17, 20, 21]);


