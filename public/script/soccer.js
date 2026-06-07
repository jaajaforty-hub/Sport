
async function getData() {
    const result = await fetch("/api/data");
    const data = await result.json();

    console.log(data);        // see the structure
    console.log(data.data);   // array of teams

    const teams = data.data;  // <-- correct
}

getData()



const matches = [


{
logo:"https://upload.wikimedia.org/wikipedia/en/5/57/%C5%A0K_Slovan_Bratislava_logo.svg",
team:"Slovan Bratislava",
country:"Slovakia"
},


{
logo:"https://upload.wikimedia.org/wikipedia/en/0/02/MSK_Zilina_logo.svg",
team:"Zilina",
country:"Slovakia"
}

];

/* MAIN MATCHES */

const matchesContainer = document.getElementById("matches-container");

matches.forEach(match=>{

matchesContainer.innerHTML += `

<div class="match-row">

<div>
<img src="${match.logo}">
</div>

<div>
${match.team}
</div>

<div>
${match.country}
</div>

<div class="odd">
${match.odd}
</div>

<div>
${match.time}
</div>

</div>

`;

});

/* TOMORROW */

const tomorrowContainer = document.getElementById("tomorrow-container");

matches.forEach(match=>{

tomorrowContainer.innerHTML += `

<div class="match-row">

<div>
<img src="${match.logo}">
</div>

<div>
${match.team}
</div>

<div>
${match.country}
</div>

<div class="odd">
${match.odd}
</div>

<div>
${match.time}
</div>

</div>

`;

});

/* UPCOMING */

const upcomingContainer = document.getElementById("upcoming-container");

matches.forEach(match=>{

upcomingContainer.innerHTML += `

<div class="match-row">

<div>
<img src="${match.logo}">
</div>

<div>
${match.team}
</div>

<div>
${match.country}
</div>

<div class="odd">
${match.odd}
</div>

<div>
${match.time}
</div>

</div>

`;

});




