const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const foods =[
    {
        name:'everydayhealth',
        address:'https://www.everydayhealth.com/weight-loss-pictures/foods-that-help-to-lose-weight.aspx',
        base:'https://www.everydayhealth.com/'
    },
    {
        name:'goodFood',
        address:'https://www.bbcgoodfood.com/howto/guide/our-top-10-fitness-foods',
        base:'https://www.bbcgoodfood.com/'
    },
    {
        // working
        name:'ucdavis',
        address:'https://health.ucdavis.edu/blog/good-food/top-15-healthy-foods-you-should-be-eating/2019/04',
        base:'https://health.ucdavis.edu/'
    },
]
// here articles means food itmes matching
const articles =[]

foods.forEach(food =>{
    axios.get(food.address)
    .then(response =>{
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("food")',html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url:food.base+url,
                source:food.name
            })
        })
    })
})

app.get('/' ,(req,res) =>{
    res.json('Welcome to my diet api')
})

app.get('/food',(req,res) =>{
    res.json(articles)
})
app.get('/food/:foodId',(req,res) =>{
    const foodId = req.params.foodId
    const  foodAddress = foods.filter(food =>food.name==foodId)[0].address
    const foodBase = foods.filter(food => food.name == foodId)[0].base

    axios.get(foodAddress)
    .then(response =>{
        const html = response.data
        const $ = cheerio.load(html)
        const specificfood =[] 

        $('a:contains("food")',html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificfood.push({
                title,
                url:foodBase+url,
                source:foodId
            })
        })
        res.json(specificfood)
    }).catch(err => console.log(err))
})

app.listen(PORT,()=> console.log(`server is running on PORT ${PORT}`))