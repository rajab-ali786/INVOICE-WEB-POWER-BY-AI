let btnToggle=document.querySelector(".btn-secondary");
let clicker=false;
btnToggle.addEventListener("click",()=>{
   document.body.classList.toggle("preview-mode")
  let text=document.getElementById("previewBtnText");
  if(!clicker){text.innerHTML="Full Edit"; clicker=true ;
  }
 else{text.innerHTML="Full Preview";clicker=false;}
});


//========= Form validation ===//
const formInputs=document.getElementById("formPage_data");
formInputs.addEventListener("submit",(event)=>{
 event.preventDefault();
 mainForm();
});
//Main page deta localstorage.
let all_data=JSON.parse(localStorage.getItem("all-data"))||[];

const getId=(id)=> document.getElementById(id).value;
const mainForm=()=>{
   //====************=== OWNER DETAILS =========***************************************=\\
   let ow_email=getId("ownerEmail");
   let ownerName=getId("ownerName");
   let ownerNum=getId("ownerNumber");
   let ownerAddrs=getId("ownerAddress");
   //*******=====≠============================================***************************
   //======= CLIENT DETAILS ============================================================\\
   let clientName=getId("clientName");
   let clNum=getId("cl-number");
   let cl_em=getId("cl-email");
   let clAddrs=getId("add-client");
   //===========================÷÷÷=======================================================
   //========== OTHERS DETAILS ===========================================================
   let invoiceNo=getId("id-num");
   let invoiceDate=getId("invoice-date");
   let inv_due=getId("in-due");
   let paySystem=getId("pay-methods");
   let itDiscrip=getId("item-discript");
   let qty=getId("it-qty");
   let price=getId("pay-price");
//=======================================================================================


if(!cl_em.includes("@")||!ow_email.includes("@")){
   return popupAlert("⚠️ Incorrect Email !");
}
let check=all_data.find(voice=> voice.invoiceInfo.id===invoiceNo);

let newAdd=false;

if(!check){
check={
  owner: {
       name: ownerName,
       email: ow_email,
       phone: ownerNum,
       address: ownerAddrs
     },
     client: {
       name: clientName,
       phone: clNum,
       email: cl_em,
       address: clAddrs
     },
     invoiceInfo: {
       id: invoiceNo,
       date: invoiceDate,
       dueDate: inv_due,
       paymentMethod: paySystem
     },
     items:[]
};
newAdd=true;
}


let findedDis=check.items.find(items=> items.discription===itDiscrip);
if(findedDis){
  popupAlert("⚠️ This item description has already been added. Please change the item name or description.");
}
else{
  check.items.push({
    discription:itDiscrip,
    price:price,
    qty:qty
  });
}
if(newAdd){
  all_data.push(check);
  popupAlert("✅ Invoice Added Successfully!");
}
 helper("showPrice").innerHTML=price;
localStorage.setItem("all-data",JSON.stringify(all_data));
tAble(check)
calculate(check);
mainPreview([check]);

//====================== Remove last One ==============================================//
let removed=document.getElementById("removeBtn");
removed.addEventListener("click",(event)=>{
  event.preventDefault();
let findDiscription=check.items.findIndex(item=>item.discription==itDiscrip);

if(findDiscription !==-1){
  check.items.splice(findDiscription,1);
}
  localStorage.setItem("all-data",JSON.stringify(all_data))
  calculate(check);
  helper("showPrice").innerHTML="";
  mainPreview([check]);
  tAble(check)
});
}

function calculate(check){
  let showItems=document.getElementById("showItems");
  let showOnthers=document.getElementById("showOnthers");
  let element;
  let prices=0;
  showItems.innerHTML="";
  showOnthers.innerHTML="";
  check.items.forEach(data=>{
    prices+=data.price*data.qty;
  });
    let gst=(prices*18)/100;
    let subtotal=prices+gst;
  element=`
   <div class="summary-row">
            <span>Subtotal</span>
                <strong>₹${prices}.00</strong>
              </div>
              <div class="summary-row">
                <span>Tax / GST (18%)</span>
                <strong>₹${gst}.00</strong>
              </div>
              <div class="summary-row grand-total">
                <span>Grand Total</span>
                <strong>₹${subtotal}.00</strong>
            </div>
  `;
  showItems.innerHTML=element;
    showOnthers.innerHTML=element;
}
function tAble(selectedNum) {
  let table = document.getElementById("tableId");
  table.innerHTML = "";

  selectedNum.items.forEach(data => {
    let itemTotal = Number(data.price) * Number(data.qty);

    table.innerHTML += `
      <tr>
        <td>${data.discription}</td>
        <td>${data.qty}</td>
        <td>₹${data.price}.00</td>
        <td>₹${itemTotal}.00</td>
      </tr>
    `;
  });
}

//========================Main page preview ==========================================//
function mainPreview(selectedData){
  selectedData.forEach(data=>{
    helper("owner-name").innerHTML=data.owner.name;
    helper("owner-email").innerHTML=data.owner.email;
    helper("owner-mobile").innerHTML=data.owner.phone;
    helper("owner-address").innerHTML=data.owner.address;
//==================================================================================
    helper("client-name").innerHTML=data.client.name;
    helper("client-mobile").innerHTML=data.client.phone;
    helper("client-email").innerHTML=data.client.email;
    helper("client-address").innerHTML=data.client.address;
    helper("main-id").innerHTML="#"+data.invoiceInfo.id;
  });
}
const helper=(id)=>document.getElementById(id);


//------========= PDF DOWNLOAD BUTTON ============//
  
let pdfLoad=helper("Pdfdownload");

pdfLoad.addEventListener("click",(e)=>{
  e.preventDefault();
const mainPreviewSection=helper("showPaper");
  const option = {
    margin: 0.5,
    filename: 'INV-001.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }
  html2pdf().set(option).from(mainPreviewSection).save();
})

//======================= DARFT OPTION ==================================================
let drafts=JSON.parse(localStorage.getItem("draft-data"))||[];

const draftButton = ()=>{
  if(helper("ownerName").value===""&&
  helper("ownerEmail").value===""||
  helper("ownerNumber").value===""||helper("clientName").value===""&&
  helper("cl-number").value===""||
  helper("cl-email").value===""||
  helper("add-client").value===""){
  popupAlert("Please fill out all required fields. This field cannot be left blank.");
  }
 let draft={
   uniqueId:Date.now(),
  owner: {
       name:helper("ownerName").value,
       email:helper("ownerEmail").value,
       phone:helper("ownerNumber").value,
       address:helper("ownerAddress").value
     },
     client: {
       name:helper("clientName").value,
       phone:helper("cl-number").value,
       email:helper("cl-email").value,
       address:helper("add-client").value
     },
     invoiceInfo: {
       id:helper("id-num").value,
       date:helper("invoice-date").value,
       dueDate:helper("in-due").value,
       paymentMethod:helper("pay-methods").value
     }
}
if(drafts.length>=3){
  popupAlert(" ⚠️ You can save a maximum of 3 drafts at a time. Please delete an old draft to save a new one");
  return
}
drafts.push(draft)
localStorage.setItem("draft-data",JSON.stringify(drafts));
  }
helper("draft-saved").addEventListener("click",draftButton);

//================================= DRAFT POPUP OPEN =====================================
helper("draft-btn").addEventListener("click",()=>{
  helper("savedModal").classList.add("active");
  dataLOad();
});
//=================== SIMPLE CLOSE ICON ===============================================
helper("closeModalBtn").addEventListener("click",()=>{
  helper("savedModal").classList.remove("active")
})
//====================== FOOTER CLOSE BUTTON =============================================
helper("closeModalFooterBtn").addEventListener("click",()=>{
  helper("savedModal").classList.remove("active");
});

//============= MAIN DATA FUNCTION OF DRAFT ==============================================
const dataLOad=()=>{
  let mainDISplay=helper("modal-body");
 mainDISplay.innerHTML="";
  drafts.forEach((item,index)=>{
    mainDISplay.innerHTML+=`
      <div class="draft-row">
        <div class="draft-info">
<strong>${index+1}) ${item.owner.name}</strong>
      <small>id:${item.uniqueId}</small>
        </div>
        <div class="draft-actions">
          <button class="btn-action edit"data-id='${item.uniqueId}'>Edit</button>
          <button class="btn-action delete">Delete</button>
        </div>
      </div>
`;
  });
  if(drafts.length==0){
    helper("modal-body").innerHTML="PAHELE KUCH DRAFT KARO";
    return;
  }
}
helper("modal-body").addEventListener("click",(event)=>{
  if(event.target.classList.contains("edit")){
  let id=event.target.dataset.id;
  editbuttonDraft(id);
  }
  else if(event.target.classList.contains("delete")){
    let id=event.target.dataset.id;
    deleteButtonDraft(id);
  }
});


//======================================== DRAFT EDIT BTN ================================
const editbuttonDraft=(selectedData)=>{
  let edited=drafts.find(draft=> draft.uniqueId ==selectedData);
  if(!edited)return;
  helper("savedModal").classList.remove("active");
  loadedInput(edited);
}
//================== all data show function input pe =====================================
const loadedInput =(draft)=>{
  helper("ownerName").value = draft.owner.name;
helper("ownerEmail").value = draft.owner.email;
helper("ownerNumber").value = draft.owner.phone;
helper("ownerAddress").value = draft.owner.address;
helper("clientName").value = draft.client.name;
helper("cl-number").value = draft.client.phone;
helper("cl-email").value = draft.client.email;
helper("add-client").value = draft.client.address;
helper("id-num").value = draft.invoiceInfo.id;
helper("invoice-date").value = draft.invoiceInfo.date;
helper("in-due").value = draft.invoiceInfo.dueDate;
helper("pay-methods").value = draft.invoiceInfo.paymentMethod;
} 



//====================== DELETE BUTTON DRAFT =============================================
const deleteButtonDraft=(selectedId)=>{
  //find index ------------
  let findIndex=drafts.findIndex(draft=> draft.uniqueId==selectedId);
  drafts.splice(findIndex,1);
  localStorage.setItem("draft-data",JSON.stringify(drafts));
  dataLOad();
}



//====================== Popup system ===================================================
const box_popup=document.getElementById("box-popup");
const popupAlert=(text)=>{
  box_popup.classList.add("show");
  let mainBox=document.getElementById("main-boxPopup");
  mainBox.innerHTML="";
  mainBox.innerHTML=`
  <div class="invoice-modal-icon">Invoice Message </div> 
  <h3>${text}</h3> 
<div class = "invoice-modal-actions">
<button type ="button"class = "modal-btn confirm"> OK </button> 
</div>`
}
box_popup.addEventListener("click",(event)=>{
  if(event.target.classList.contains("confirm")){
    box_popup.classList.remove("show");
  }
});