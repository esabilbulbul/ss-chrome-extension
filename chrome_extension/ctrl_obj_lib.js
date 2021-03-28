/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var goArrayTimer = [];
var gArrayRadioButtons = [];

var gBrowserType = "";

var REG_KEY_IS_MOUSE_OVER           = 'MOUSE_OVER_ON';

var TMR_INDEX_ID           = 0;
var TMR_INDEX_UN           = 1;
var TMR_INDEX_STAT         = 2;
var TMR_INDEX_FNC          = 3;
var TMR_INDEX_CNTR         = 4;
var TMR_INDEX_ONLY_ONCE    = 5;
var TMR_INDEX_OBJECT       = 6;//Timer Object

var gIDPRFX_TIMER_TEXTBOX_CHANGE_DETECT = 'TMR_TXTBOX_CHANGE_DETECT_';
var gActive_TextboxChangeDetect = false;

var gDataTextbox_ChangeDetect = [];
var gINDEX_TXTBOX_CHNGDTCT_ID          = 0;
var gINDEX_TXTBOX_CHNGDTCT_LASTVAL     = 1;
var gINDEX_TXTBOX_CHNGDTCT_LASTFIREVAL = 2;

CtrlObj = 
{
    
    Create_Div: function(pDivId, pCSS, pStyle, pTitle, pbFocus)
    {
        var div = document.createElement("div");

        //div.appendChild(pBtn_Element);    
        div.id=pDivId;
        
        if (pCSS!="")
            div.setAttribute('class', pCSS);

        if (pStyle!=null)
            div.setAttribute('style', pStyle);
        
        if (pTitle!=null)
            div.title = pTitle;
        
        if (pbFocus==true)
            div.tabIndex = -1;//script only focusable
        
        return div;
    },
    
    Create_Canvas: function(pId, pCSS, pStyle)
    {
        var oCanvas    = document.createElement("canvas");
        
        oCanvas.id = pId;
        
        return oCanvas;
    },
    
    Create_IFrame: function(pId, pSrc, pWidth, pHeight, pCallbackonLoad)
    {
        var oIFrame = document.createElement("IFRAME");
        
        oIFrame.id     = pId;
        oIFrame.src    = pSrc;
        oIFrame.width  = pWidth;
        oIFrame.height = pHeight;
        
        oIFrame.setAttribute('frameBorder', '0');
        oIFrame.setAttribute('allowFullScreen', '');
        oIFrame.setAttribute('allow', 'autoplay; encrypted-media');
        
        if (Util.misc.isNull(pCallbackonLoad)==false)
        {
            oIFrame.addEventListener("load", pCallbackonLoad);
        }
        
        return oIFrame;
    },
    
    Create_Caret: function(pId, pCSS)//DOWN CARET
    {
        var oI = CtrlObj.Create_I(pId);
        
        oI.setAttribute("class", "fa fa-caret-down");
        oI.setAttribute("style", "padding-left:2px;vertical-align:text-bottom;");
        
        return oI;

        /*
        var oSpn = document.createElement("span");
        //var oP   = CtrlObj.Create_Paragraph_Element("","","");
        oSpn.setAttribute("class", "caret");
        //oP.appendChild(oSpn);
        //oSpn.innerHTML = "<span class='caret'></span>";
        return oSpn;
        */
    },
    
    //Create_Caret_X: function(pId, pCSS)
    Create_Web_Icon: function(pId, pCSS, pStyle)
    {
        var oI = CtrlObj.Create_I(pId, pCSS);
        
        oI.setAttribute("class", pCSS);
        var sStyle = "padding-left:2px;vertical-align:text-bottom;";
        if (!( (pStyle=='') || (pStyle==null) ))
            sStyle += pStyle;
        
        oI.setAttribute("style", sStyle);

        return oI;
    },
    
    /*
     * 
        <div style="display:inline-table;vertical-align: top;">
            <div style="display: table-cell;vertical-align: middle;">
                <div style="margin-bottom: auto;margin-top: auto;color:gray;">
                    <-- TO BE CENTRALIZED OBJECT HERE -->
                </div>
            </div>
        </div>
     * 
     * @param {type} pId
     * @param {type} psStyle
     * @returns {undefined}
     */
    Placein_Center_Vertical: function(pId, pCSS, psStyle, pObj, pbInline)
    {
        var oDiv_L1 = CtrlObj.Create_Div(pId, pCSS);
        var oDiv_L2 = CtrlObj.Create_Div("", "");
        var oDiv_L3 = CtrlObj.Create_Div("", "");
        
        var sStyle = psStyle + ";";
        if (pbInline==false)
        {
            sStyle += Util.style.addStyleAttrib("display"         , "table");
        }
        else
        {
            sStyle += Util.style.addStyleAttrib("display"         , "inline-table");
        }
        sStyle += Util.style.addStyleAttrib("vertical-align"  , "top");
        oDiv_L1.setAttribute("style", sStyle);
        
        var sStyle = "";
        sStyle += Util.style.addStyleAttrib("display"         , "table-cell");
        sStyle += Util.style.addStyleAttrib("vertical-align"  , "middle");
        oDiv_L2.setAttribute("style", sStyle);
        
        var sStyle = "";
        sStyle += Util.style.addStyleAttrib("margin-bottom"   , "auto");
        sStyle += Util.style.addStyleAttrib("margin-top"      , "auto");
        oDiv_L3.setAttribute("style", sStyle);
                
        oDiv_L3.appendChild(pObj);
        oDiv_L2.appendChild(oDiv_L3);
        oDiv_L1.appendChild(oDiv_L2);
        
        return oDiv_L1;
    },
    
    /*
     * Requirement: font awesome css file required 
     * 
     * <i class="fa fa-dollar" style="font-size:0.8em;" aria-hidden="true"></i>
     * 
     * @param {type} pId
     * @param {type} pCurrency
     * @param {type} psStyle
     * @returns {undefined}
     */
    Create_Currency: function(pId, pCurrency, psStyle)
    {
        var sClassName = "fa fa-dollar";//Default dollar
        var sCurrency = pCurrency.toUpperCase();
        
        if (sCurrency=="USD")
        {
            sClassName = "fa fa-dollar";
        }
        else if (sCurrency=="EUR")
        {
            sClassName = "fa fa-eur";
        }
        else if (sCurrency=="JPY")
        {
            sClassName = "fa fa-jpy";
        }
        else if (sCurrency=="RMB")
        {
            sClassName = "fa fa-jpy";
        }
        else if (sCurrency=="YEN")
        {
            sClassName = "fa fa-jpy";
        }
        else if (sCurrency=="GBP")
        {
            sClassName = "fa fa-gbp";
        }
        else if (sCurrency=="KRW")
        {
            sClassName = "fa fa-krw";
        }
        else if (sCurrency=="TRY")
        {
            sClassName = "fa fa-try";
        }
        else if (sCurrency=="INR")
        {
            sClassName = "fa fa-inr";
        }
        else if (sCurrency=="ILS")
        {
            sClassName = "fa fa-ils";
        }
        else
        {
            sClassName = "fa fa-dollar";
        }
        
        var oI = CtrlObj.Create_I(pId, sClassName);
        
        if (psStyle!="")
            oI.setAttribute("style", psStyle);
        
        return oI;
    },
    
    Create_Strike: function(pId)
    {
        var oStrike  = document.createElement("strike");
        
        return oStrike;
    },
    
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Requirements
    // <link rel="stylesheet" type="text/css" href="../../../../CONTROLS/stars/starrange.css">
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    Create_Star: function(pId, psStyle, pbHalf)
    {
        if (pbHalf==1)
            var oSpn  = CtrlObj.Create_Span('fa fa-star');
        else if (pbHalf==0.5)
            var oSpn  = CtrlObj.Create_Span('fal fa-star-half');            
        else if (pbHalf==0)
            var oSpn  = CtrlObj.Create_Span('fal fa-star');
        
        if (Util.misc.isNull(psStyle)==false)
            oSpn.setAttribute("style", psStyle);
        
        return oSpn;
        
        /*
        var oSpn  = document.createElement("span");
        var oStar = CtrlObj.CreateTextElement_Plain("☆");
        
        oSpn.appendChild(oStar);
        
        oSpn.setAttribute("style", psStyle);
       
        return oSpn;
        */
    },
    
    Create_Heart: function(pId, pHalf, pCSS, pStyle)
    {
        if (pHalf==1)
        {
            //var IdMainBase= pId;//CtrlDefault.generateId_Halfheart(pId);

            var sCSS = '';
            if (Util.misc.isNull(pCSS)==false)
                sCSS += ' ' + pCSS;

            var sStyle = 'display:inline-block;vertical-align: top;width:1em;position:relative';
            if (Util.misc.isNull(pStyle)==false)
                sStyle += ';' + pStyle;

            var oDiv_MainBase = CtrlObj.Create_Div(pId, pCSS, sStyle);

            var Idemptypart= '';//CtrlDefault.generateId_emptypart(pId); 
            var oDiv_emptypart = CtrlObj.Create_Div(Idemptypart, 'fal fa-heart','position:absolute;color:lightgrey;left:0');

            var Idfullpart= '';//CtrlDefault.generateId_fullpart(pId); 
            var oDiv_fullpart = CtrlObj.Create_Div(Idfullpart,'fa fa-heart','position:absolute;overflow:hidden;width:0.5em;color:inherit;left:0;');

            oDiv_MainBase.appendChild(oDiv_emptypart);
            oDiv_MainBase.appendChild(oDiv_fullpart);
            
        }
        else if (pHalf==0)
        {
            var sStyle = 'width:1em;';
             if (Util.misc.isNull(pStyle)==false)
                sStyle += ';' + pStyle;
            
            var sCSS = 'fa fa-heart';
            if (Util.misc.isNull(pCSS)==false)
                sCSS += ' ' + pCSS;
            
            var oDiv_MainBase = CtrlObj.Create_Div(pId, sCSS, sStyle);
        }
        else if (pHalf==-1)
        {
            var sStyle = 'width:1em;';
             if (Util.misc.isNull(pStyle)==false)
                sStyle += ';' + pStyle;
            
            var sCSS = 'fal fa-heart';
            if (Util.misc.isNull(pCSS)==false)
                sCSS += ' ' + pCSS;
            
            var oDiv_MainBase = CtrlObj.Create_Div(pId, sCSS, sStyle);
        }
        
        return oDiv_MainBase;
    } , 


    
    Create_Span: function(pCSS, pId, pStyle)
    {
        var oSpn = document.createElement("span");
        //var oP   = CtrlObj.Create_Paragraph_Element("","","");
        oSpn.setAttribute("class", pCSS);
        
        if (pId!="")
            oSpn.id = pId;
        //oP.appendChild(oSpn);
        //oSpn.innerHTML = "<span class='caret'></span>";
        
        if (pStyle!="")
            oSpn.setAttribute("style", pStyle);
        
        return oSpn;
        
    },
    
    Create_I: function(pId, pCSS)
    {
        var oI = document.createElement("i");
        oI.id = pId;
        
        if (pCSS!="")
            oI.setAttribute("class", pCSS);
        
        return oI;
    },
    
    Create_Datebox: function(pId, pTxt, pCSS, pStyle)
    {
        var chkbox = document.createElement("input");
        //var ochktxt= CtrlObj.CreateTextElement_Plain(pTxt);
        
        chkbox.id = pId;
        chkbox.setAttribute("type","date");
        chkbox.value=pTxt;
        //chkbox.setAttribute("value",pTxt);
        
        if (pCSS!="")
            chkbox.setAttribute("class", pCSS);
        
        if (pStyle!='')
            chkbox.setAttribute('style', pStyle);
        //chkbox.appendChild(ochktxt);

        return chkbox;
    },

    Create_Checkbox: function(pId, pTxt, pCSS)
    {
        var chkbox = document.createElement("input");
        //var ochktxt= CtrlObj.CreateTextElement_Plain(pTxt);
        
        chkbox.id = pId;
        chkbox.setAttribute("type","checkbox");
        chkbox.value=pTxt;
        //chkbox.setAttribute("value",pTxt);
        
        if (pCSS!="")
            chkbox.setAttribute("class", pCSS);
        
        //chkbox.appendChild(ochktxt);

        return chkbox;
    },

    Create_Combobox: function(pId, pCSS, ponChangeFunc, pValue, pName)
    {
        var sel = document.createElement("select");
        sel.id  = pId;
     
        if (pCSS!="")
            sel.setAttribute('class', pCSS);
        
        sel.onchange = function(){ CtrlObj.cmbonChange(this, ponChangeFunc); };

        if (Util.misc.isNull(pValue)==false)
            sel.value = pValue;
        
        sel.name = pName;
        
        return sel;
    },
    
    cmbonChange: function(sel, pCallbackFnc)
    {
        if (pCallbackFnc!=null)
            pCallbackFnc();
    },

    addItem2Combobox: function(pId, pTxt, pKey)
    {
        var oItem  = CtrlObj.Create_Combobox_Item(pTxt);
        var oCombo = CtrlObj.getObject(pId);
        oCombo.name= pKey;
        
        oCombo.appendChild(oItem);
    },

    // DIV + A
    Create_Info: function(pId, pTxt, pStyle)
    {
        var oDiv = CtrlObj.Create_Div('', '');
        var oA   = CtrlObj.Create_Ahref_Element('', pTxt, '#', '');
        
        if (pStyle!='')
            oA.setAttribute('style', pStyle);
        
        oDiv.appendChild(oA);
        
        return oDiv;
    },

    Create_Combobox_Item: function(pTxt, pName, pStyle, pTitle, pbHidden)
    {
        var item = document.createElement("option");

        //item.id  = pId;
        if (pName!=null)
            item.name= pName;
        else
            item.name= pTxt;

        item.text= pTxt;

        if (pbHidden==true)
        {
            item.hidden = true;
        }
        
        if (pTitle!=null)
            item.title = pTitle;
        
        if (pStyle!='')
            item.setAttribute('style', pStyle);


        return item;
    },
    
    Get_ComboboxValue: function(pId)
    {
        return document.getElementById(pId).value;
    },
    
    Create_List_ul: function(pId, pCSS)
    {
        var ul = document.createElement('ul');
        
        ul.id = pId;
        ul.setAttribute('class', pCSS);
        
        return ul;
    },
    
    Create_ListItem_li: function(pId, pListCSS, pName, pCSS, pbImg)
    {
        var li  = document.createElement('li');        
        
        if (pbImg==true)
        {
            var ImgId = pId + "img";
            
            var Img = CtrlObj.Create_Img(ImgId, pName, pCSS);
            
            li.appendChild(Img);            
        }
        else
        {
            var txt = CtrlObj.Create_Ahref_Element("",pName,"",pCSS);
            li.appendChild(txt);
            
            li.id=pId;
            li.setAttribute('class', pListCSS);
        }
        
        return li;
    },
    
    Create_Header3: function(pId, pName, pCSS)
    {        
        var H3 = document.createElement("H3");
        var text = CtrlObj.CreateTextElement_Plain(pName);

        H3.appendChild(text);
        //div.appendChild(pBtn_Element);    
        H3.id=pId;
        H3.setAttribute('class', pCSS);        

        return H3;

    },

    CreateTextElement_Underlined: function(pName, pStyle)
    {
        var u_text = document.createElement("U");//U: Underline element tag
        var txt = document.createTextNode(pName);

        u_text.appendChild(txt);
        
        if (pStyle!=null)
           u_text.setAttribute('style', pStyle);

        return u_text;
    },    
    
    Create_Center: function(pId)
    {
        var oCenter = document.createElement("center");
        if (! ( (pId==null) || (pId=="")) )
            oCenter.id = pId;
        
        return oCenter;
    },
    
    Create_Img: function(pImgId, pImg, pCSS, psStyle)
    {
        var div = document.createElement("img");

        div.id=pImgId;
        if (Util.misc.isNull(pImg)==false)
            div.src=pImg;
        
        if (Util.misc.isNull(pCSS)==false)
            div.className = pCSS;
            //div.setAttribute('class', pCSS);

        if (Util.misc.isNull(psStyle)==false)
            div.setAttribute('style', psStyle);
        
        return div;
    },
    
    Create_Form: function(pId, pAction, pMethod)
    {
        var Frm = document.createElement("form");
        //Frm.id     = pId;
        Frm.method = pMethod;
        Frm.action = pAction;
        
        return Frm;
    },
    
    CreateTextElement_A_Plain: function(pId, pName, psStyle, psCSS, psKey, pToggleElementId, pTitle)
    {
        var sStyle = "";
        
        if (psStyle)
            sStyle = psStyle;
        
        var sCSS = '';
        if (Util.misc.isNull(psCSS)==false)
            sCSS = psCSS;
        
        return CtrlObj.Create_Ahref_Element(pId, pName, "", sCSS, "text-decoration: none;" + sStyle, pTitle, psKey);
        //return CtrlObj.Create_Label(pId, pName, sStyle, sCSS, psKey, pToggleElementId);
    },

    Create_Label: function(pId, pTxt, psStyle, pCSS, psKey, pToggleElementId, pForId)
    {
        var A     = document.createElement('LABEL');//LABEL
        var AText = document.createTextNode(pTxt);

        A.appendChild(AText);

        if (pCSS!="")
            A.setAttribute('class', pCSS);

        if (psStyle!="")
            A.setAttribute('style', psStyle);
        
        if (pForId!="")
            A.htmlFor = pForId;
        
        A.id = pId;

        if (psKey!=null) 
        {
            if (psKey!='')
            {
                A.name = psKey;
            }
        }
        
        if (pToggleElementId!=null)
        {
            A.for = pToggleElementId;
        }
        
        return A;
    },
    
    CreateTextElement_Plain: function(pName)
    {
        var txt = document.createTextNode(pName);

        return txt;
    },
    
    Create_Paragraph_Element: function(pId, pName, pCSS)
    {
        var p = document.createElement("p");
        var t = CtrlObj.CreateTextElement_Plain(pName);
        
        p.appendChild(t);
        
        p.id=pId;
        p.setAttribute('class', pCSS);
        
        return p;
    },

    Create_Bold_Ahref: function(pId, pTxt, pURL, pCSS, pAStyle)
    {
        var oA = CtrlObj.Create_Ahref_Element(pId, pTxt, pURL, pCSS)
        var oB = CtrlObj.Create_B_Element('');
        
        oB.appendChild(oA);
        
        if (pAStyle!='')
            oA.setAttribute('style', pAStyle);
        
        return oB;
    },
    
    Create_B_Element: function(pId)
    {
        var B     = document.createElement('b');
        
        if (Util.misc.isNull(pId)==false)
            B.id = pId;
        
        return B;
    },

    removeTabIndex: function(pId)
    {
        var Obj = CtrlObj.getObject(pId)
        
        if (Obj!=null)
            Obj.tabIndex = -1;
    },

    Create_RadioButton: function(pId, pTxt, pCSS, pCallback, pGroupId, pbIgnoreRegister)
    {
        CtrlObj.registerNewRadioButton(pId, pGroupId, pbIgnoreRegister);
        
        var label = document.createElement("label");
        var radio = document.createElement("input");

        radio.type  = "radio";
        radio.id    = pId;
        radio.value = pTxt;

        radio.addEventListener('click', function(){ CtrlObj.onclick_RadioButton(pId, pGroupId); } );
        if (pCallback!=null)
        {
            //radio.onclick = function(){ CtrlObj.onclick_RadioButton(pId, pGroupId, pCallback); };
            radio.addEventListener('click', pCallback );
        }

        label.appendChild(radio);

        label.appendChild(document.createTextNode(pTxt));

        return label;
    },

    onclick_RadioButton: function(pId, pGroupId)
    {
        for (var i=0; i<gArrayRadioButtons.length; i++)
        {
            if (gArrayRadioButtons[i][0]==pGroupId)
            {
                if (gArrayRadioButtons[i][1]!=pId)//except the caller button
                {
                    var oRadioBtn = CtrlObj.getObject(gArrayRadioButtons[i][1]);
                    if (oRadioBtn!=null)
                    {
                        oRadioBtn.checked = false;
                    }
                }
            }
        }
    },

    registerNewRadioButton: function(pId, pGroupId, pbIgnoreRegister)
    {
        if (pbIgnoreRegister==false)
        {
            var newIndex = gArrayRadioButtons.length;

            gArrayRadioButtons[newIndex] = [];
            gArrayRadioButtons[newIndex][0] = pGroupId;
            gArrayRadioButtons[newIndex][1] = pId;
        }
    },

    //pFor = for dialog boxes
    /*
    Create_Label: function(pId, pTxt, pURL, pCSS, pFor)
    {
        var oA;
        //var oA     = document.createElement('span');
        //oA.value = pTxt;
        oA = CtrlObj.Create_Ahref_Element(pId, pTxt, pURL, "");
        
        if (pCSS!="")
        {
            oA.setAttribute('class', pCSS);
        }
        
        if (pFor!='')
        {
            oA.htmlFor = pFor;
        }
        
        //oA.textDecoration = 'none';
        
        return oA;
        
    },
    */
    
    Create_Ahref_Element: function(pId, pTxt, pURL, pCSS, psStyle, pTitle, psKey, pbTarget)
    {
        var A     = document.createElement('a');
        var AText = document.createTextNode(pTxt);
        
        A.appendChild(AText);
        
        if (pCSS!="")
            A.setAttribute('class', pCSS);

        if (psStyle!="")
            A.setAttribute('style', psStyle);
        
        if (Util.misc.isNull(pTitle)==false)
            A.title = pTitle;
        else
            A.title = '';

        
        if (pbTarget==true)
        {
            A.target = '_blank';
        }
        
        A.id = pId;
        
        if (pURL!="")
        {
            A.href = pURL;
        }
        else
        {
            A.rel = 'nofollow';//SEO Pays attention
        }
        
        if (psKey!=null) 
        {
            if (psKey!='')
            {
                A.name = psKey;
            }
        }
        
        return A;
    },
    
    setAhrefvalue: function(pId)
    {
        //var oA = CtrlObj.getObject(pId);
        
    },

    Create_Table: function(pId, pName, pCSS)
    {
        var TBL     = document.createElement('table');
        
        if (pCSS!="")
            TBL.setAttribute('class', pCSS);
        TBL.id=pId;
        
        return TBL;
    },

    Create_Textarea: function(pId, pName, piRow, piCol, pCSS, pStyle, pVal, pbCleanonFocus)
    {
        var txtArea = document.createElement("textarea");
        
        txtArea.id   = pId;
        txtArea.name = pName;
        
        if (!(piRow==null) || (piRow==""))
        {
            txtArea.rows = piRow;
        }
        /*
        else
        {
            txtArea.rows = 3;// default
        }
        */
        
        if (!(piCol==null) || (piCol==""))
        {
            txtArea.cols = piCol;
        }
        /*
        else
        {
            txtArea.cols = 50;//default
        }
        */

        if (pCSS!="")
            txtArea.setAttribute("class",pCSS);

        if (Util.misc.isNull(pStyle)==false)
            txtArea.setAttribute('style', pStyle);

        if (Util.misc.isNull(pVal)==false)
            txtArea.value = pVal;

        if (pbCleanonFocus==true)
        {
            txtArea.addEventListener("focus", function(){ CtrlObj.events.onfocusclean_inputbox(pId, pVal); } );
            txtArea.addEventListener("blur" , function(){ CtrlObj.events.onblur_inputbox(pId, pVal, this, false, null, null); } );
        }

        return txtArea;
    },

    Create_Passwordbox: function(pName, pId, pCSS, pStyle, pbCleanonFocus)
    {
        /*
            pName, 
            pId, 
            pCSS, 
            pVal, = pName
            psStyle, 
            pbCleanonFocus, 
            pbCurrency, 
            psFormat, 
            piDecimalLen, 
            pbChangeDetect, 
            pCallbackonChangeDeteced, 
            pInterval,
            pbIgnoreListeners
         */
        //pName = pVal (here)
        var oTxtbox = CtrlObj.Create_Textbox(   '', 
                                                pId, 
                                                pCSS, 
                                                pName, 
                                                pStyle, 
                                                pbCleanonFocus, 
                                                false, 
                                                null, 
                                                null, 
                                                false, 
                                                null, 
                                                -1, 
                                                true,
                                                true);
        //oTxtbox.type = 'password';//activate on focus
        oTxtbox.onfocus = function(){ CtrlObj.onfocus_pwdbox2(this, pName); };
        oTxtbox.onblur  = function(){ CtrlObj.onblur_pwdbox2(this, pName); };

        return oTxtbox;

        /*
        var txtbox = document.createElement("input");
        
        txtbox.value = pName;
        txtbox.id = pId;
        txtbox.setAttribute("type","text");
        //txtbox.setAttribute("type", "password");
        
        if (pCSS!="")
            txtbox.setAttribute("class",pCSS);
        
        txtbox.onfocus = function(){ CtrlObj.onfocus_pwdbox(txtbox); };
        txtbox.onblur  = function(){ CtrlObj.onblur_pwdbox(txtbox, pName); };
        
        return txtbox;
        */
    },

    onfocus_pwdbox2: function(pThis, pDefaultVal)
    {
        pThis.type = 'text';

        if(pThis.value.trim()==pDefaultVal)
        {
           pThis.value = '' ;
        }

    },
    
    onblur_pwdbox2: function(pThis, pDefaultVal)
    {
        //alert(pThis.value);
        pThis.type = 'password';
        
        if (pThis.value.trim().length==0)
        {
            pThis.value = pDefaultVal;
        }
    },
    
    onfocus_pwdbox: function(poBox)
    {
        poBox.setAttribute("type", "password");
    },

    onblur_pwdbox: function(poBox, pDefVal)
    {
        var sVal = poBox.value;
        
        if ( (sVal==pDefVal) || (sVal=="") )
        {
            poBox.setAttribute("type", "text");
        }
    },
    
    Create_Filebox: function(pId, pName, pCSS, psStyle, pCallbackFnc)
    {
        var txtbox = document.createElement("input");
        
        txtbox.id = pId;
        txtbox.setAttribute("type","file");
        //var sStyle = Util.style.addStyleAttrib('type','file');
        //txtbox.setAttribute("spellcheck","false");
        
        if (pCSS!="")
            txtbox.setAttribute("class",pCSS);
        
        if (Util.misc.isNull(psStyle)==false)
        {
            txtbox.setAttribute("style", psStyle);
        }
        
        
        if (pCallbackFnc!=null)
        {
            txtbox.onchange = pCallbackFnc;
            //txtbox.addEventListener("change", myScript);
        }
        
        return txtbox;
    },

    //psFormat = en-US (for example)
    //if psFormat null or empty then the default browser settings will be used
    Create_Textbox: function(pName, 
                             pId, 
                             pCSS, 
                             pVal, 
                             psStyle,
                             pbCleanonFocus, //default false
                             pbCurrency, //default false
                             psFormat, //default null
                             piDecimalLen, //
                             pbChangeDetect, //default false
                             pCallbackonChangeDeteced, 
                             pInterval,//default 400 ms
                             pbIgnoreListeners,
                             pbBorderHighlightON)
    {
        var txtbox = document.createElement("input");

        txtbox.id = pId;
        txtbox.setAttribute("type","text");
        txtbox.setAttribute("spellcheck","false");

        if (pCSS!="")
            txtbox.setAttribute("class",pCSS);
        
        if (pVal!="")
        {   
            txtbox.value = pVal;
        }

        txtbox.name = pVal;//don't use name because there are others i.e password box and so on

        if (Util.misc.isNull(psStyle)==false)
        {
            txtbox.setAttribute("style", psStyle);
        }

        // DEFAULT LISTENERS
        txtbox.addEventListener("keydown", CtrlObj.events.onkeydown_textbox_default);
        txtbox.addEventListener("focus"  , function(e){ CtrlObj.events.onfocus_textbox_default(e, this, pbBorderHighlightON); } );
        txtbox.addEventListener("blur"   , function(e){ CtrlObj.events.onblur_textbox_default(e , this, pVal); });

        if (pbCleanonFocus==true)
        {
            if (!(pbIgnoreListeners==true))//for password box only
            {
                txtbox.addEventListener("focus", function(){ CtrlObj.events.onfocusclean_inputbox(pId, pVal, pbBorderHighlightON); } );
                txtbox.addEventListener("blur" , function(){ CtrlObj.events.onblur_inputbox(pId, pVal, this, pbCurrency, psFormat, piDecimalLen, pbBorderHighlightON); } );

                if (pbCurrency==true)
                {
                    txtbox.addEventListener("keydown", CtrlObj.events.onkeydown_textbox);
                    txtbox.addEventListener("keyup"  , function(e){ CtrlObj.events.onkeyup_textbox(e, this, pbCurrency, psFormat, piDecimalLen); } );
                }
            }

        }

        if (pbChangeDetect==true)
        {
            //----------------------------------------------------
            //Add New Var 2 ChgDet database
            //----------------------------------------------------
            if (Util.misc.isNull(pId)==false)
            {
                var newIndex = CtrlObj.misc.findTextBoxDetectIndex(pId); 

                if (newIndex==-1)
                {
                    newIndex = gDataTextbox_ChangeDetect.length;

                    gDataTextbox_ChangeDetect[newIndex] = [];
                    gDataTextbox_ChangeDetect[newIndex][gINDEX_TXTBOX_CHNGDTCT_ID]      = pId;
                    gDataTextbox_ChangeDetect[newIndex][gINDEX_TXTBOX_CHNGDTCT_LASTVAL] = ''; 
                    gDataTextbox_ChangeDetect[newIndex][gINDEX_TXTBOX_CHNGDTCT_LASTFIREVAL] = '';
                }
            }

            txtbox.addEventListener("keydown", function(){ CtrlObj.events.onkeydown_changedetect_inputbox(pId, pVal, pCallbackonChangeDeteced, pInterval); } );
            txtbox.addEventListener("blur"  , function(e){ CtrlObj.events.onblur_stoptimer_inputbox(e, this, pId); } );
            
        }

        return txtbox;
    },
    
    Create_Button: function(pId, pName, pCSS)
    {
        var btn = document.createElement("button");
        var txt = document.createTextNode(pName);
        
        btn.appendChild(txt);

        if (pCSS!="")
        {
            btn.setAttribute('class', pCSS);
        }
        
        btn.id=pId;
        
        return btn;
    },

     /* *************************************************************
     * 
     *                      TABLE GRID LIBRARY
     * 
     * *************************************************************/
     /*
     * <thead>
     *      <tr>
     *          <th>
     *              <td> Colname </td>
     *          </th>
     *      </tr>
     * </thead>
     * 
     */
    Create_TableHeader: function(pTHId)//<th>
    {
        var oTHeader = document.createElement('th');
        
        //var Txt      = CtrlObj.CreateTextElement_Plain(pHeaderText);
        
        //oTHeader.appendChild(Txt);
        if (pTHId!="")
            oTHeader.id = pTHId;
        //TH_NewHeader.id  = IdRowHeader_TH;

        return oTHeader;
    },
    
    Create_Col: function(pId)
    {
        var oCol = document.createElement('col');
        
        if (pId!="")
            oCol.id = pId;

        return oCol;
    },
    
    Create_TableCell: function(pTDId, pText, pImg)//<td>
    {
        var oTD = document.createElement('td');
        var otxt = document.createTextNode(pText);
        
        oTD.appendChild(otxt);
        
        if (pTDId!="")
            oTD.id = pTDId;
        //TH_NewHeader.id  = IdRowHeader_TH;

        return oTD;
    },
    
    Create_TableRow: function(pRowId, pCSS)
    {
        var TR_NewRow  = document.createElement('tr');
            
        if(pCSS!="")
            TR_NewRow.setAttribute('class', pCSS);
        
        TR_NewRow.id = pRowId;
        
        return TR_NewRow;

    },
    
    Create_TableColumn: function(pTableId, pId, pName, pCSS)
    {
        var IdTableRow   = "TableRow";
        var NameTableRow = IdTableRow + pTableId;
        
        var IdTableCol   = "TableCol";
        var NameTableCol  = IdTableCol + pId;
        
        rc = Util.element.isExist_name(NameTableRow);
        if (rc==false)
        {
            var row     = document.createElement('tr');
            row.id   = IdTableRow;
            row.name = NameTableRow;
        }
        else
        {
            var row     = document.getElementsByName(NameTableRow);
        }
        
        var col     = document.createElement('th');
        
        col.id   = IdTableCol;
        col.name = NameTableCol;
        
        col.setAttribute('class', pCSS);
        
        row.appendChild(col);
        
        if (pCSS!="")
            row.setAttribute('class', pCSS);
        
        return row;
    },

    HideObject: function(pId)
    {
        document.getElementById(pId).style.visibility="hidden";
    },
    
    ShowObject: function(pId)
    {
        document.getElementById(pId).style.visibility="visible";
    },

    getBody: function()
    {
        return document.getElementsByTagName("BODY")[0];
    },
    
    getObject: function(pId)
    {
        if (pId.toLowerCase()!='body')
            return document.getElementById(pId);
        else
            return document.getElementsByTagName("BODY")[0];
    },
    
    getTextBoxValue: function(pId)
    {
        var oTextBox = CtrlObj.getObject(pId);
        var sVal     = oTextBox.value;
        
        return sVal;
    },
    
    appendChild: function(pMain, pChild, pElInsertBefore)
    {
        if (pElInsertBefore==null)
        {
            pMain.appendChild(pChild);
        }
        else
        {
            pMain.insertBefore(pChild, pElInsertBefore);
        }
        
    },
    
    getObjectbyClass: function(pCSS)
    {
        return document.getElementsByClassName(pCSS);
    },
    
    removeObject: function(pId)
    {        
        var node = CtrlObj.getObject(pId);

        if (gBrowserType=="")
        {
            gBrowserType = Util.browser.getBrowserType();            
        }
        
        if (gBrowserType=="ie")
        {
            if (node)
            {
                if (node.parentNode)
                {
                    node.parentNode.removeChild(node);
                    return;
                }
            }
        }
        
        if (gBrowserType=="chrome")
        {
            node.remove();
            return;
        }

        node.remove();//last resort
        
        //By Default
        /*
        node.style.height = '0px';
        node.style.width  = '0px';
        node.style.visibility = 'hidden';
        node.style.fontSize = '0px';
        */
        return;
    },

    
    /* *************************************************************
     * 
     *************************************************************/
    /*
    createRegistry: function(pElId)
    {
        Registry.createRegistry(pElId);
    },
    
    //createRegistry: function(pElId, pRegKey, pRegValue)
    addRegistry: function(pElId, pRegKey, pRegValue)
    {
        return Registry.addRegistry(pElId, pRegKey, pRegValue);
    },
    
    readRegistry: function(pElId, pRegKey)
    {
        return Registry.readRegistry(pElId, pRegKey);
    },
    
    updateRegistry: function(pElId, pRegKey, pRegVal)
    {
        return Registry.updateRegistry(pElId, pRegKey, pRegVal);
    },
    
    getRegKey: function(pElId, pRegKey)
    {
        return Registry.getRegKey(pElId, pRegKey);
        //return pElId + ':' + pRegKey;
    },
    */
    /* *************************************************************
    * 
    *                          THREAD
    * 
    * *************************************************************/
    createThread: function(pCallback)
    {
        setTimeout(pCallback, 1);
    },

    /* *************************************************************
    * 
    *                          TIMER
    * 
    * *************************************************************/
   
    resetTimer: function(pFnc, pMSeconds, pId, pbOnlyOnce)
    {
        startTimer(pFnc, pMSeconds, pId, pbOnlyOnce);
    },

    startTimer: function(pFnc, pId, pMSeconds, pbOnlyOnce)
    {
        //var iMax = -1;
        
        //This -1 and null part is patch from old version of Timer to the new version
        if ( (pbOnlyOnce==-1) || (Util.misc.isNull(pbOnlyOnce)==true) )
            pbOnlyOnce = false;
        
        var sUN = Util.random.generateRandom();
        
        var oTimer = setTimeout(function(){ CtrlObj.TimerFunction(pFnc, pId, pMSeconds, sUN); },pMSeconds);
        
        CtrlObj.registerNewTimer(pId, pFnc, pbOnlyOnce, sUN, oTimer);
        
        //CtrlObj.registerNewTimer(pId, pFnc, pbOnlyOnce, sUN);
        
        //setTimeout(function(){ CtrlObj.TimerFunction(pFnc, pId, pMSeconds, sUN); },pMSeconds);
        
        return sUN;
    },

    TimerFunction: function(pFnc, pId, pMSeconds, pUN)
    {
        var Index   = CtrlObj.getTimerIndex(pId, pUN);

        if (Index!=-1)
        {
            if (goArrayTimer[Index][TMR_INDEX_STAT]!=false)//if not stopped
            {
                var Fnc = goArrayTimer[Index][TMR_INDEX_FNC];
                
                Fnc();
                
                if (goArrayTimer[Index][TMR_INDEX_ONLY_ONCE]==false)
                {
                    setTimeout(function(){ CtrlObj.TimerFunction(pFnc, pId, pMSeconds, pUN); },pMSeconds);
                }
            }
        }
        
    },

    stopTimer: function(pId, pUN)
    {
        for (i=0;i<goArrayTimer.length;i++)
        {
            if (pId == goArrayTimer[i][TMR_INDEX_ID])
            {
                goArrayTimer[i][TMR_INDEX_STAT]=false;
                
                var oTimer = goArrayTimer[i][TMR_INDEX_OBJECT];
                if (oTimer!=null)
                {
                    clearTimeout(oTimer);
                }
            }
        }
        /*
        var Index           = CtrlObj.getTimerIndex2(pId, pUN);
        if (Index!=-1)
        {
            goArrayTimer[Index][TMR_INDEX_STAT]=false;
            
            return true;
        }
        
        return false;
        */
    },
    
    isTimerExist: function(pId, pUN)
    {
        var Len = goArrayTimer.length;
        
        for (var i=0;i<Len;i++)
        {
            if ( (pId == goArrayTimer[i][TMR_INDEX_ID]) && (pUN == goArrayTimer[i][TMR_INDEX_UN]) )
            {
                return i;
            }
        }
        
        return -1;
    },
    
    getTimerIndex: function(pId, pUN)
    {
        for (i=0;i<goArrayTimer.length;i++)
        {
            if ((pId == goArrayTimer[i][TMR_INDEX_ID]) && (pUN == goArrayTimer[i][TMR_INDEX_UN]))
            {
                return i;//active/inactive
            }
        }
        
        return -1;
    },

    registerNewTimer: function(pId, pFnc, pbOnlyOnce, pUN, poTimer)
    {
        var Index = CtrlObj.isTimerExist(pId, pUN);
        if (Index==-1)
        {
            var newIndex = goArrayTimer.length;
            var ColIndex = 0;
            goArrayTimer[newIndex] = [];
            goArrayTimer[newIndex][TMR_INDEX_ID] = pId;  // 0
            goArrayTimer[newIndex][TMR_INDEX_UN] = pUN;  // 1
            goArrayTimer[newIndex][TMR_INDEX_STAT] = true; // 2
            goArrayTimer[newIndex][TMR_INDEX_FNC] = pFnc; // 3
            goArrayTimer[newIndex][TMR_INDEX_CNTR] = 0;//counter  // 4
            goArrayTimer[newIndex][TMR_INDEX_ONLY_ONCE] = pbOnlyOnce; // 5
            goArrayTimer[newIndex][TMR_INDEX_OBJECT] = poTimer;
            
        }
        else
        {
            goArrayTimer[Index][1] = true;
        }
    },
    

    /*
    startTimer: function(pFnc, pId, pMSeconds, pMax)
    {
        var iMax = -1;

        if ( (pMax==false) || (pMax==true) )
        {
            iMax = -1;
        }
        else
        {
            if (pMax!=null)
                iMax = pMax;
        }
        
        CtrlObj.registerNewTimer(pId, pFnc, iMax);
        setTimeout(function(){ CtrlObj.TimerFunction(pFnc, pId, pMSeconds); },pMSeconds);
        
    },

    registerNewTimer: function(pId, pFnc, pMax, pUN)
    {
        var Index = CtrlObj.isTimerExist(pId);
        if (Index==-1)
        {
            var newIndex = goArrayTimer.length;
            var ColIndex = 0;
            goArrayTimer[newIndex] = [];
            goArrayTimer[newIndex][0] = pId;  // 0            
            goArrayTimer[newIndex][1] = true; // 2
            goArrayTimer[newIndex][2] = pFnc; // 3
            goArrayTimer[newIndex][3] = 0;//counter  // 4
            goArrayTimer[newIndex][4] = pMax; // 5
            goArrayTimer[newIndex][5] = pUN;  // 1
        }
        else
        {
            goArrayTimer[Index][1] = true;
        }
    },
    
    stopTimer: function(pId)
    {
        var Index           = CtrlObj.getTimerIndex(pId);
        if (Index!=-1)
        {
            goArrayTimer[Index][1]=false;
            
            return true;
        }
        
        return false;
    },
    
    isTimerExist: function(pId)
    {
        var Len = goArrayTimer.length;
        
        for (var i=0;i<Len;i++)
        {
            if (pId == goArrayTimer[i][0])
            {
                return i;
            }
        }
        
        return -1;
    },
    
    TimerFunction: function(pFnc, pId, pMSeconds)
    {
        //This sets timer until it is stopped (infinite loop) stoped by other functions when goArrayTimer[Index][1] set to false
        var Index           = CtrlObj.getTimerIndex(pId);
        //var iTimerNumber    = oArrayTimer.length;
        
        if (Index!=-1)
        {
            if (goArrayTimer[Index][1]!=false)//if not stopped
            {
                var iCounter = goArrayTimer[Index][3];
                var iMax     = goArrayTimer[Index][4];
                
                if ((iMax==-1) || (iCounter<iMax))
                {

                    goArrayTimer[Index][3] += pMSeconds;//counter

                    var Fnc = goArrayTimer[Index][2];

                    //Call function
                    //pFnc();
                    Fnc();

                    //Reset for the next calls
                    //CtrlObj.resetTimer(function(){ pFnc(pGridId); }, pId, pMSeconds);
                    setTimeout(function(){ CtrlObj.TimerFunction(pFnc, pId, pMSeconds); },pMSeconds);
                    //setTimeout(function(){ CtrlObj.TimerFunction(pFnc); },pMSeconds);
                }
            }
        }
        //
    },
    
    getTimerIndex: function(pId)
    {
        for (i=0;i<goArrayTimer.length;i++)
        {
            if (goArrayTimer[i][0]==pId)
            {
                return i;//active/inactive
            }
        }
        
        return -1;
    },
    */

    /* *************************************************************
     *                          HOVER CLICK
     *                          
     * This enables objects to open up when mouse hovered for given
     * time. For instance; mouse hover on drop down more than .3 sec
     * or tooltab menu header hovering
    *************************************************************/
    onHoverClick: function(pId, pFncCallback, pTimeoutSec, pPrm1, pPrm2, pPrm3)
    {
        var bStat = Registry.readRegistry(pId, REG_KEY_IS_MOUSE_OVER);
        if (Util.misc.isNull(bStat)==true)
        {
            Registry.createRegistry(pId);
            //Create Entry
            Registry.addRegistry(pId, REG_KEY_IS_MOUSE_OVER          , false);
        }
        
        Registry.updateRegistry(pId, REG_KEY_IS_MOUSE_OVER, true);

        CtrlObj.startTimer(function(){ CtrlObj.fireHoverClick(pId, pFncCallback, pPrm1, pPrm2, pPrm3); }, pId, pTimeoutSec, true);
    },
   
    fireHoverClick: function(pId, pFncCallback, pPrm1, pPrm2, pPrm3)
    {
        var bStat = Registry.readRegistry(pId, REG_KEY_IS_MOUSE_OVER);
        if (bStat=="true")
        {
            pFncCallback(pId, pPrm1, pPrm2, pPrm3);
        }
        CtrlObj.stopTimer(pId);
    },
    
    resetHoverClick: function(pId)
    {
        Registry.updateRegistry(pId, REG_KEY_IS_MOUSE_OVER, false);
    },
    
    isMouseOver: function(pId)
    {
        var bStat = Registry.readRegistry(pId, REG_KEY_IS_MOUSE_OVER);
        if (bStat=="true")
            return true;
        else
            return false;
    },
    
    /* *************************************************************
     * 
    *************************************************************/
    transform: function(pId, pDirection, pDelta, pDelaySecond)
    {
        //var IdContent    = CtrlSlider.getId_Content(pId);
        var oContent     = CtrlObj.getObject(pId);
        
        if (pDelaySecond==null)
            var sStyle  = "transition:0s;";
        else
            var sStyle  = "transition:" + pDelaySecond + 's;';
        
        if (pDirection=='X')
            sStyle += 'transform: translateX(' + pDelta + ')';
        else
            sStyle += 'transform: translateY(' + pDelta + ')';

        oContent.setAttribute('style',sStyle);
        //document.getElementById('slidercontent').setAttribute('style',sStyle);

    },

     /* *************************************************************
     * 
     *  Next Two function is used to inject the object created 
     *  with the codes above to the doc
     * 
     * *************************************************************/

    Append2Frame: function(pNodId, pElement)
    {
        document.getElementById(pNodId).appendChild(pElement);
    },

    //Function tries not to inject cross HTMLs
    //function Inject2Frame(pFrameHTMLName, pElement)
    Inject2Frame: function(pElement)
    {
        document.body.appendChild(pElement);
    },
    
    misc:
    {
setCaret: function(pel, pos)
        {
            if(pel != null) 
            {
                if(pel.createTextRange) 
                {
                    var range = pel.createTextRange();
                    range.move('character', pos);
                    range.select();
                }
                else 
                {
                    if(pel.selectionStart)
                    {
                        pel.focus();
                        pel.setSelectionRange(pos, pos);
                    }
                    else
                        pel.focus();
                }
            }
        },
        
        findTextBoxDetectIndex: function(pId)
        {
            for (var i=0; i<gDataTextbox_ChangeDetect.length; i++)
            {
                if (gDataTextbox_ChangeDetect[i][gINDEX_TXTBOX_CHNGDTCT_ID]==pId)
                {
                    return i;
                }
            }
            
            return -1;
        },

        //if change detect = true
        getTextBoxLastValue: function(pId)
        {
            var index = CtrlObj.misc.findTextBoxDetectIndex(pId);
            if (index!=-1)
            {
                return gDataTextbox_ChangeDetect[index][gINDEX_TXTBOX_CHNGDTCT_LASTVAL];
            }
            
            return '';
        }
    },

    events:
    {
        //This is the timer detect function
        onChangeDetect: function(pId, pCallback)
        {
            var oTxtbox  = CtrlObj.getObject(pId);
            var sCurVal  = oTxtbox.value;

            var sLastVal = CtrlObj.misc.getTextBoxLastValue(pId);

            //If two values are same then type stopped
            //Then fire to callback/search

            var index = CtrlObj.misc.findTextBoxDetectIndex(pId);
            if (sCurVal.trim()==sLastVal.trim())
            {
                var sLastFireVal = gDataTextbox_ChangeDetect[index][gINDEX_TXTBOX_CHNGDTCT_LASTFIREVAL];
                
                if (sLastFireVal.trim()!=sCurVal.trim())
                {
                    gDataTextbox_ChangeDetect[index][gINDEX_TXTBOX_CHNGDTCT_LASTFIREVAL] = sCurVal;

                    if (pCallback!=null)
                        pCallback(pId, sCurVal);
                }
            }
            else
            {
                gDataTextbox_ChangeDetect[index][gINDEX_TXTBOX_CHNGDTCT_LASTVAL] = sCurVal;
            }

        },

        onkeydown_changedetect_inputbox: function(pId, pVal, pCallbackonChangeDetect, pInterval)
        {

            if (gActive_TextboxChangeDetect==false)
            {
                var IdTimer = gIDPRFX_TIMER_TEXTBOX_CHANGE_DETECT + pId; 
            
                var iInterval = 400;//400 ms default
                if (pInterval!=null)
                    iInterval = pInterval;

                gActive_TextboxChangeDetect = true;

                CtrlObj.startTimer(function(){ CtrlObj.events.onChangeDetect(pId, pCallbackonChangeDetect); }, IdTimer, iInterval, false);
            }

        },

        onfocusclean_inputbox: function(pId, pVal, pbBorderHighlightON)
        {
            var oInputbox = document.getElementById(pId);

            if (oInputbox!=null)
            {
                if (oInputbox.value == pVal)//default value
                {
                    oInputbox.value = '';
                }
                
            }
            
            //oInputbox.style.boxShadow = '0px 0px 1px 1px rgba(51, 122, 183, 1)';
        },
        
        onblur_stoptimer_inputbox: function(e, pthis, pId)
        {
            //Stop Change Detect Timer
            gActive_TextboxChangeDetect = false;

            var IdTimer = gIDPRFX_TIMER_TEXTBOX_CHANGE_DETECT + pId; 
            CtrlObj.stopTimer(IdTimer);
        },

        onblur_inputbox: function(pId, pVal, pthis, pbCurrency, psFormat, piDecimalLen, pbBorderHighlightON)
        {
            var oInputbox = document.getElementById(pId);

            if (oInputbox!=null)
            {
                
                if (pbBorderHighlightON==true)
                    oInputbox.style.boxShadow = '';

                if (oInputbox.value == '')
                {
                    oInputbox.value = pVal;
                }
            }

            //if (pbCurrency==true)
            //{
                //CtrlObj.events.onblur_textbox(pthis, psFormat, piDecimalLen);
            //}

        },

        onfocus_textbox_default: function(e, pthis, pbBorderHighlightON)
        {
            if (pbBorderHighlightON==true)
                pthis.style.boxShadow = '0px 0px 2px 2px rgba(80, 147, 206, 1)';
        },

        onblur_textbox_default: function(e, pthis, pDefaultVal)
        {
            pthis.style.boxShadow = '';
            
            if (pthis.value=='')
            {
                pthis.style.color = '';
            }
            else
            {
                //alert(pthis.style.color + '-' + pthis.value + '-' + pDefaultVal);
            }
        },

        onkeydown_textbox_default: function(e)
        {
            this.style.color = '#383838';
        },

        onkeydown_textbox: function(e)
        {
            switch(e.keyCode)
            {
                case 13:
                case 8:
                case 46:
                case 37://left arrow
                case 39://right arrow

                    return true;

                break;
                default:

                    if ((e.keyCode>=48) && (e.keyCode<=57))
                        return true;

                break;
            }

            e.preventDefault();
            return false;
        },

        onblur_textbox: function(pthis, psFormat, pbDecimalLen)
        {
            var aNumberParts    = pthis.value.split('.');
            var sIntegerPart    = aNumberParts[0];
            var sFractionPart   = aNumberParts[1];

            if (Util.misc.isNumber(sIntegerPart)==true)
            {
                var Final = new Util.format.reformat2Currency(sIntegerPart, sFractionPart, pbDecimalLen, psFormat);
                pthis.value = Final.value;
            }
            /*
            var sIntegerFormatted = Util.format.Text2Currency(sIntegerPart);
            if (Util.misc.isNull(sFractionPart)==false)
                this.value = sIntegerFormatted + '.' + (sFractionPart + '00').substring(0,2);
            else
                this.value = sIntegerFormatted + '.00';
            */
        },

        onkeyup_textbox: function(e, pthis, pbCurrency, psFormat, piDecimalLen)
        {
            //this.value = Util.format.Text2Currency(this.value);
            if ((e.keyCode==13) || (e.keyCode==8) || (e.keyCode==46) || (e.keyCode==37) || (e.keyCode==39))
            {
                return ;
            }

            if ((e.keyCode>=48) && (e.keyCode<=57))
            {
                var iSelStart       = pthis.selectionStart;

                //SPLIT PARTS
                //---------------------------------------------------
                var aNumberParts    = pthis.value.split('.');
                var sIntegerPart    = aNumberParts[0];
                var sFractionPart = aNumberParts[1];

                var bSelIntegerPart = false;
                if (iSelStart<=sIntegerPart.length)
                    bSelIntegerPart = true;

                var iNumberSeperatorBefore  = Util.format.calcCurrencySeperators(sIntegerPart);

                //REFORMAT THE VALUE
                //---------------------------------------------------
                var iCursorStart = e.target.selectionStart;

                var jFormatCurrency = { style:'currency',currency:"USD",  maximumFractionDigits:2, minimumFractionDigits:2};
                var val = pthis.value;
                if (pthis.value=='')
                {
                    val = '0';
                }

                var sLocale = psFormat;
                if (Util.misc.isNull(psFormat)==true)
                    sLocale = Util.browser.getLanguage();

                if (sLocale=='tr-TR')//the list of countries using . for seperator: https://en.wikipedia.org/wiki/Decimal_separator
                    val = Util.string.replaceAll(val, '.', ''); //val.replace('.', '');//decimal will be seperated with comma in TR
                else
                    val = Util.string.replaceAll(val, ',', ''); //val = val.replace(',', '');

                var prevVal = pthis.name;

                if (prevVal=='')//or default value (first attempt)
                {
                    val = Number(val).toLocaleString('en-US', jFormatCurrency);

                    val = val.substr(1);//remove currency sign

                    pthis.name = val;
                    pthis.value = val;

                    CtrlObj.misc.setCaret(pthis, 1);//default start
                }
                else
                {
                    val = Number(val).toLocaleString('en-US', jFormatCurrency);
                    val = val.substr(1);//remove currency sign
                    pthis.name = val;

                    if (Math.abs(prevVal.length - val.length)>1)//format kicked in (, or .)
                    {
                        pthis.value = val;

                        CtrlObj.misc.setCaret(pthis, iCursorStart+1);
                    }
                    else
                    {
                        pthis.value = val;

                        CtrlObj.misc.setCaret(pthis, iCursorStart);
                    }
                }

                var newVal = pthis.value;

                /*
                var Final  = new Util.format.reformat2Currency(sIntegerPart, sFractionPart, piDecimalLen, psFormat);
                pthis.value = Final.value;

                var iNumberSeperatorNow     = Util.format.calcCurrencySeperators(Final.partInteger);
                */

                //SETTING CARET POSITION
                //---------------------------------------------------
                /*
                if (bSelIntegerPart==true)
                {
                    if (iNumberSeperatorNow!=iNumberSeperatorBefore)
                        iSelStart++;

                    CtrlObj.misc.setCaret(pthis, iSelStart);
                }
                else
                {
                    CtrlObj.misc.setCaret(pthis, iSelStart);
                }
                 */
            }
        },


    }//end of events

}


