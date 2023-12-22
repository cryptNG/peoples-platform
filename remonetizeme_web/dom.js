function updateDonations(donations){
    let  months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let curMonth = (new Date()).getMonth();
    let curYear = (new Date()).getFullYear();
    if(document.querySelectorAll('#donation-month-buckets table thead tr td').length===0)
    {
        let th = document.querySelector('#donation-month-buckets table thead');

        let tr = document.createElement("tr");
        let colSpan = 1;
        let lY=(curYear -2  + Math.trunc((curMonth + 1) / 12));
        for (let index = 0; index < 48; index++) {
            
            let y = (curYear -2  + Math.trunc((index +curMonth + 2) / 12));
            
            if(y!= lY ){
                
                let td = document.createElement("td");
                td.colSpan=colSpan;
                let span = index==23? document.createElement("b"): document.createElement("span");
                span.innerHTML= lY.toString();
                td.appendChild(span);
                tr.appendChild(td);
                lY=y;
                colSpan=1;
            }else{
                colSpan++;
            }
            
        }
        
        th.appendChild(tr);
        tr = document.createElement("tr");
        for (let index = 0; index < 48; index++) {
            
            let td = document.createElement("td");
            let span = index==23? document.createElement("b"): document.createElement("span");
            span.innerHTML= months[(curMonth + index +1) % 12].substring(0,3);
            td.appendChild(span);
            tr.appendChild(td);
        }
        th.appendChild(tr);
    }
    document.querySelector('#donation-month-buckets table tbody tr')?.remove();
    let tb = document.querySelector('#donation-month-buckets table tbody');
    tr = document.createElement("tr");
    tb.appendChild(tr);
    for (let index = 0; index < 48; index++) {
        
        let td = document.createElement("td");
        let span = document.createElement("span");
        span.classList="bar val-"+Math.trunc(donations[index].relValue*255);
        span.innerHTML=`&nbsp`;
        if(index===35) td.classList="scroll";
        td.appendChild(span);
        span = document.createElement("span");
        span.classList="tick";
        span.innerHTML=`${(Number(donations[index].value)/1000).toFixed(3)}`;
        if(index===35) td.classList="scroll";
        td.appendChild(span);
        tr.appendChild(td);
    }
    tb.appendChild(tr);

    document.querySelector('#donation-month-buckets table tbody .scroll').scrollIntoView(false);
}

function updateOverallVotes(voteGroups){
    let  months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let curMonth = (new Date()).getMonth();
    let curYear = (new Date()).getFullYear();
    if(document.querySelectorAll('#votes-month-buckets table thead tr td').length===0)
    {
        let th = document.querySelector('#votes-month-buckets table thead');

        let tr = document.createElement("tr");
        let colSpan = 1;
        let lY=(curYear -2  + Math.trunc((curMonth + 1) / 12));
        for (let index = 0; index < 24; index++) {
            
            let y = (curYear -2  + Math.trunc((index +curMonth + 2) / 12));
            
            if(y!= lY ){
                
                let td = document.createElement("td");
                td.colSpan=colSpan;
                let span = index==23? document.createElement("b"): document.createElement("span");
                span.innerHTML= lY.toString();
                td.appendChild(span);
                tr.appendChild(td);
                lY=y;
                colSpan=1;
            }else{
                colSpan++;
            }
            
        }
        
        th.appendChild(tr);
        tr = document.createElement("tr");
        for (let index = 0; index < 24; index++) {
            
            let td = document.createElement("td");
            let span = index==23? document.createElement("b"): document.createElement("span");
            span.innerHTML= months[(curMonth + index +1) % 12].substring(0,3);
            td.appendChild(span);
            tr.appendChild(td);
        }
        th.appendChild(tr);
    }
    document.querySelector('#votes-month-buckets table tbody tr')?.remove();
    let tb = document.querySelector('#votes-month-buckets table tbody');
    tr = document.createElement("tr");
    tb.appendChild(tr);
    const dateId = curYear*12+curMonth;
    for (let index = -23 ; index <= 0; index++) {
        
        let td = document.createElement("td");
        let span = document.createElement("span");
        const voteGroup = voteGroups['id'+(dateId-index)];
        span.classList="bar val-"+Math.trunc(voteGroup===undefined?0:voteGroup.relVotesLength*255);
        span.innerHTML=`&nbsp`;
        if(index===35) td.classList="scroll";
        td.appendChild(span);
        span = document.createElement("span");
        span.classList="tick";
        span.innerHTML=`${voteGroup===undefined?0:voteGroup.votes.length}`;
        if(index===35) td.classList="scroll";
        td.appendChild(span);
        tr.appendChild(td);
    }
    tb.appendChild(tr);

}

function updateUniqueContentReceiverSender(voteGroups){
    let  months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let curMonth = (new Date()).getMonth();
    let curYear = (new Date()).getFullYear();
    if(document.querySelectorAll('#votee-month-buckets table thead tr td').length===0)
    {
        let th = document.querySelector('#votee-month-buckets table thead');

        let tr = document.createElement("tr");
        let colSpan = 1;
        let lY=(curYear -2  + Math.trunc((curMonth + 1) / 12));
        for (let index = 0; index < 24; index++) {
            
            let y = (curYear -2  + Math.trunc((index +curMonth + 2) / 12));
            
            if(y!= lY ){
                
                let td = document.createElement("td");
                td.colSpan=colSpan;
                let span = index==23? document.createElement("b"): document.createElement("span");
                span.innerHTML= lY.toString();
                td.appendChild(span);
                tr.appendChild(td);
                lY=y;
                colSpan=1;
            }else{
                colSpan++;
            }
            
        }
        
        th.appendChild(tr);
        tr = document.createElement("tr");
        for (let index = 0; index < 24; index++) {
            
            let td = document.createElement("td");
            let span = index==23? document.createElement("b"): document.createElement("span");
            span.innerHTML= months[(curMonth + index +1) % 12].substring(0,3);
            td.appendChild(span);
            tr.appendChild(td);
        }
        th.appendChild(tr);
    }
    document.querySelector('#votee-month-buckets table tbody tr')?.remove();
    let tb = document.querySelector('#votee-month-buckets table tbody');
    tr = document.createElement("tr");
    tb.appendChild(tr);
    const dateId = curYear*12+curMonth;
    for (let index = -23 ; index <= 0; index++) {
        
        let td = document.createElement("td");
        const voteGroup = voteGroups['id'+(dateId-index)];

        let span = document.createElement("span");
        
        span.classList="column-bar col-1 val-"+Math.trunc(voteGroup===undefined?0:voteGroup.relUniqueSender*255);
        span.innerHTML=`<em>${voteGroup===undefined?0:voteGroup.uniqueSender}</em>`;
        td.appendChild(span);
   
        span = document.createElement("span");
        
        span.classList="column-bar col-2 val-"+Math.trunc(voteGroup===undefined?0:voteGroup.relUniqueContent*255);
        span.innerHTML=`<em>${voteGroup===undefined?0:voteGroup.uniqueContent}</em>`;
        td.appendChild(span);

        span = document.createElement("span");
        
        span.classList="column-bar col-3 val-"+Math.trunc(voteGroup===undefined?0:voteGroup.relUniqueReceiver*255);
        span.innerHTML=`<em>${voteGroup===undefined?0:voteGroup.uniqueReceiver}</em>`;
        td.appendChild(span);

        td.appendChild(span);
        tr.appendChild(td);
    }
    tb.appendChild(tr);

}

function updateRecentVotes(votes){
    
    

    document.querySelectorAll('#recent-votes table tbody tr').forEach(n=>n.remove());
    const tb = document.querySelector('#recent-votes table tbody');
    
    votes.reverse().forEach((v)=>{

    
        const tr = document.createElement("tr");
        let td = document.createElement("td");
        let span = document.createElement("span");
        span.classList="vote";
        span.innerHTML=v.up?"⇑":"⇓";
        td.appendChild(span);
        tr.appendChild(td);


        td = document.createElement("td");
        span = document.createElement("span");
        span.classList="title";
        span.innerHTML=v.title;
        td.appendChild(span);
        tr.appendChild(td);
        
        td = document.createElement("td");
        a = document.createElement("a");
        a.href=v.url;
        a.target="_blank";
        a.classList="url";
        a.innerHTML=v.url.replace('https://www.youtube.com/watch?v=','');
        td.appendChild(a);
        tr.appendChild(td);
        tb.appendChild(tr);
    });
    

}

function updateDonated(donated){
    
    

    document.querySelectorAll('#platform-donations table tbody tr').forEach(n=>n.remove());
    const tb = document.querySelector('#platform-donations table tbody');
    
    donated.reverse().forEach((d)=>{

    
        const tr = document.createElement("tr");
        let td = document.createElement("td");
        let span = document.createElement("span");
        span.classList="name";
        span.innerHTML=d.name === ''?"Anonymous":d.name;
        td.appendChild(span);
        tr.appendChild(td);


        td = document.createElement("td");
        span = document.createElement("span");
        span.classList="amount";
        span.innerHTML=(Number(d.donatedFinney) / 1000).toFixed(3);
        td.appendChild(span);
        tr.appendChild(td);
        
        td = document.createElement("td");
        span = document.createElement("span");
        span.classList="month";
        span.innerHTML=d.month;
        td.appendChild(span);
        tr.appendChild(td);

        td = document.createElement("td");
        span = document.createElement("span");
        span.classList="year";
        span.innerHTML=d.year;
        td.appendChild(span);
        tr.appendChild(td);
        tb.appendChild(tr);
    });
    

}

