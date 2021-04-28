const searchbtn=document.querySelector(".search-btn");    
const input=document.querySelector("#search");
const mealcont=document.querySelector(".meal-container");  


async function getmealbyid(id)
{   
    const meal=await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const respo= await meal.json();
    const data=respo.meals[0];

    return data;
}



async function randomMeal(){
    let randomres= await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const randomjson=await randomres.json();
  const randomdata=randomjson.meals[0];
  loaddata(randomdata);
    popupopener(randomjson);
    favadder(randomjson);
 
};
randomMeal();


  
async function getsearchresult(item){
  const searchitems=await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+item);
  const searchjson=await searchitems.json();
  mealcont.innerHTML="";
  for(let r=0;r<searchjson.meals.length;r++)
  {
    loaddata(searchjson.meals[r]);
  }
  popupopener(searchjson);
  favadder(searchjson);
};

searchbtn.addEventListener('click',()=>{
    getsearchresult(input.value);
  });


  
input.addEventListener('keyup',(e)=>{
  if(e.key=="Enter")
  {
    getsearchresult(input.value);
  }
});



function loaddata(data){
    mealcont.innerHTML+=` <div class="random">random recipe</div>
    <div class="meal meal-${data.idMeal}"  >
        <img src=${data.strMealThumb} alt="${data.strMeal}" class="meal-img">
        <div class="meal-header">
            <h4>${data.strMeal}</h4>
            <button class="heart heart-${data.idMeal}"><i class="fas fa-heart fa-2x"></i></button>
        </div>
    </div>
    </div>`;
}

function makelist(data)
{
  let l= `<ul class="list-ing">`
    for(let i=1;i<=20;i++)
    {
      let k="strIngredient"+i;
        let j="strMeasure"+i;
      if(data[k]===""||data[k]==="null")
      break;
      else
      { 
        l=l+`<li>${data[k]} - ${data[j]}.</li>`
      }
    }
    l=l+`</ul>`
    return l;
}


function closepopup(data){
    document.body.classList.remove("black");
    document.body.removeChild(document.querySelector('.container-inner'));
    document.querySelector('.container').classList.remove('none');
}




function popupopener(data)
{
  const mealclick=document.querySelectorAll('.meal');
  for(let m=0;m<mealclick.length;m++)
  {
    mealclick[m].addEventListener('click',()=>{
      let list=makelist(data.meals[m]);
      document.body.classList.add('black');
      let divi=document.createElement("div");
      divi.classList.add("container-inner");
      divi.innerHTML=`
      <div class="inner-meal-container">
        <button onclick="closepopup()" class="inner-circle"> <i class="fas fa-times fa-3x   "></i></button>
         <div class="heading">
             <h1>${data.meals[m].strMeal}</h1>
         </div> 
       
          <img src=${data.meals[m].strMealThumb} alt=${data.meals[m].strMeal}>
          <p class="procedure">${data.meals[m].strInstructions}</p>

          <h3>Ingredients:</h3>
            ${list}
      </div>`
       document.body.appendChild(divi);
       document.querySelector('.container').classList.add('none')
    })
  }
};


function favadder(d){

  const favmealcontainer=document.querySelector('.fav-meal-list');
  const hearts=document.querySelectorAll('.heart');
  for(let m=0;m<hearts.length;m++)
  {
      hearts[m].addEventListener('click',(e)=>{
        e.stopPropagation();
        let i=d.meals[m].strMealThumb+'/preview';
        if(!hearts[m].querySelector('i').classList.contains('active')===true)
        {
          hearts[m].querySelector('i').classList.add("active");
   favmealcontainer.innerHTML+=`<div id="${d.meals[m].idMeal}" class="fav-img-${d.meals[m].idMeal} fav-img" onmouseover="hov(this)" onmouseout="hovo(this)" data-b="false" >
   <button class="circle-${d.meals[m].idMeal} circle" id="${d.meals[m].idMeal}" > <i class="far fa-times-circle "></i></button>
   <img src=${i} alt="${d.meals[m].strMeal}" class="fav-imgimg" >
   <div class="pa">${d.meals[m].strMeal}</div>
</div>
`;   
         addclick();
        }
        else{
          hearts[m].querySelector('i').classList.remove("active");
          document.querySelector(`.fav-img-${d.meals[m].idMeal}`).remove();
        }
      })
        
  }
};
async function addclick()
{
   
    const favimg=document.querySelectorAll(`.fav-img`);
     favimg.forEach((item)=>{
        item.addEventListener('click',async function(){
            const id=item.getAttribute('id');
            const data= await getmealbyid(id);
        let list=makelist(data);
        document.body.classList.add('black');
        let divi=document.createElement("div");
        divi.classList.add("container-inner");
        divi.innerHTML=`
        <div class="inner-meal-container">
          <button onclick="closepopup()" class="inner-circle"> <i class="fas fa-times fa-3x   "></i></button>
           <div class="heading">
               <h1>${data.strMeal}</h1>
           </div> 
         
            <img src=${data.strMealThumb} alt=${data.strMeal}>
            <p class="procedure">${data.strInstructions}</p>
      
            <h3>Ingredients:</h3>
              ${list}
        </div>`
         document.body.appendChild(divi);
         document.querySelector('.container').classList.add('none');
    })
    const id=item.getAttribute('id');
    const btn=document.querySelector(`.circle-`+id);
    btn.addEventListener('click',(e)=>{
       e.stopPropagation();
        const ids=btn.getAttribute('id');
        const h=document.querySelector('.heart-'+ids);
        if(h!==null)
        {
        h.querySelector('i').classList.remove('active');
        }
        const fav=document.querySelector('.fav-img-'+ids);
        fav.outerHTML="";
    })
})
};
      


function hov(item)
{
  item.querySelector('.circle').classList.add('hover');
    };

function hovo(item)
{
  item.querySelector('.circle').classList.remove('hover');
}




