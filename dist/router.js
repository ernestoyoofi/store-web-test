document.querySelectorAll("[routerlist] [routerpush]").forEach(e=>{e.addEventListener("click",t=>{if(e.getAttribute("routerpush")){let r=document.querySelectorAll("[routerpage]"),l=[];r.forEach(e=>{e.getAttribute("routerpage")&&l.push(e.getAttribute("routerpage"))});let o=l.indexOf(e.getAttribute("routerpush"));-1!==o&&(r.forEach(e=>{e.style.display="none"}),r[o].style.display="block")}})}),document.querySelectorAll("[routerpage]").forEach(e=>{e.style.display="none"}),document.querySelectorAll("[routerpage]")[0].style.display="block";