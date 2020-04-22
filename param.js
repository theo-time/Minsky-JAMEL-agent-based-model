SlidersElt = document.getElementById("Sliders")


SliderBox = new sliderBoxC(SlidersElt)


SliderBox.createSlider("Scale", 0, 2, 1, 0.01, function(e){
    scaleValue = e.target.value
    console.log('ok')
})

SliderBox.createSlider("Minimum Wage", 0, 200, 10, 1, function(e){
    minimumWage = parseInt(e.target.value,10)
    console.log(minimumWage)
})

SliderBox.createSlider("FPS", 0, 100, 2, 0.1, function(e){
    frameRate(parseInt(e.target.value,10))
})




function sliderBoxC(parent){
    this.Sliders = []
    this.Container = document.createElement('div') 
    parent.appendChild(this.Container)

    this.createSlider = function (label, min, max, value, step, handler) {
        var slContainer = document.createElement('div')
            slContainer.setAttribute('class', 'slContainer')

        var labelDiv = document.createElement('div')
        var labelText = document.createElement('p')
            labelText.textContent = label
            labelDiv.appendChild(labelText)
            labelDiv.setAttribute('class', 'label')
            slContainer.appendChild(labelDiv)

        var valueDiv = document.createElement('div')
        var valueText = document.createElement('p')
            valueText.textContent = value
            valueDiv.appendChild(valueText)
            valueDiv.setAttribute('class', 'label')
            slContainer.appendChild(valueDiv)

        var slider = document.createElement('input')
            slider.setAttribute('class','slider')
            slider.setAttribute('type','range')
            slider.setAttribute('min',min)
            slider.setAttribute('max',max)
            slider.setAttribute('value',value)
            slider.setAttribute('step',step)
            slContainer.appendChild(slider)
            slider.id = "slider" + Sliders.children.length
            slider.addEventListener('change',handler)
            this.Sliders.push(slider)
            this.Container.appendChild(slContainer)
    }

}

