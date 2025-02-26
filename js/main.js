class FormValidation{
    selectors ={
        form: '[data-id="form"]',
        errMessage: '[data-id="fieldErrorMessage"]'
    }
    constructor(){
        this.bindEvents();
    }

    validityState ={
        patternMismatch: (target)=>`${target.title}`,
        tooLong: (target)=>`Макисмальное количество символов - ${target.maxLength}`,
        tooShort: (target)=>`Минимальное количество символов - ${target.minLength}`,
        valueMissing: ()=>`Это поле не может быть пустым`
    }

    showErrMessage(target,messages){
        const fieldErrorMessageElement = target.parentNode.querySelector(this.selectors.errMessage);
        fieldErrorMessageElement.innerHTML = `${messages.map((e)=>`<span>${e}</span>`).join('')}`;
    }
    validateFormElement(target){
        const {validity} = target;
        console.log(validity);
        const errMessages = [];
        Object.entries(this.validityState).forEach(([err,getErrMessage])=>{
            if(validity[err]){
                errMessages.push(getErrMessage(target));
            }
        });
        const isValid = errMessages.length === 0;
        this.showErrMessage(target,errMessages);
        target.ariaInvalid = !isValid;
        return isValid;
    }
    onBlur(event){
        const {target} = event;
        const isForm = target.closest(this.selectors.form);
        if(target.required && isForm){
            this.validateFormElement(target);
        }
    }

    onChange(event){
        const {target} = event;
        const isForm = target.closest(this.selectors.form);
        const isToggleType = ['radio','checkbox'].includes(target.type);
        if(isForm && isToggleType){
            this.validateFormElement(target);
        }
    }
    onSubmit(event){
        const {target} = event;
        const form = target.closest(this.selectors.form);
        if(!form){
            return;
        }
        let isValid = true;
        let firstInvalidElemet = null
        const requiredElements = [...form.elements].filter((e)=>e.required);
        requiredElements.forEach((e)=>{
            if(!this.validateFormElement(e)){
                isValid = false;
                if(!firstInvalidElemet){
                    firstInvalidElemet = e;
                }
            }
        });
        if(!isValid){
            event.preventDefault();
            firstInvalidElemet.focus();
        }
    }
    bindEvents(){
        document.addEventListener('blur',(event)=>{
            this.onBlur(event);
        },{capture: true});
        document.addEventListener('change',(event)=>{
            this.onChange(event);
        });
        document.addEventListener('submit',(event)=>{
            this.onSubmit(event);
        })
    }
}

new FormValidation();