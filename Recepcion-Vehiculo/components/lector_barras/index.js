/*--------------------------------------------------------------------
Fecha: 21/08/2017
Detalles: 
Captura la imagen de la placa y obtiene los datos
Selecciona una placa y obtiene los datos
Escanea el codigo de barras del automovil, recupera el chasis y obtiene los datos
Ingresa texto de Placa o VIN y obtiene los datos
Autor: RRP.
--------------------------------------------------------------------*/

// 'use strict';


var resp = "Error";
var respimagen;

app.lector_barras = kendo.observable({
    onShow: function () {

        if (localStorage.getItem("ls_verRecepcion").toLocaleString() == "0") {

            vaciaCampos();
            onDeviceReady();
        }
        else {
            localStorage.setItem("ls_verRecepcion", "0");
        }
    },
    afterShow: function () { }
});
app.localization.registerView('lector_barras');

// START_CUSTOM_CODE_lector_barras
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    $(document).ready(function () {
        $("#tabstrip").kendoTabStrip({
            animation: {
                open: {
                    effects: "fadeIn"
                }
              
            }
        });
    });


   //---------------------------------------------------------------------------

  resetControls("");

    navigator.splashscreen.hide();
    var app = new App();
    app.run();
}

function App() { }

App.prototype = {
    resultsField: null,


    _pictureSource: null,
    _destinationType: null,

    run: function () {
        var that = this,
            scanButton = document.getElementById("scanButton");

        //RRP: boton captura placa -----------------------------
        var capturePhotoButton = document.getElementById("capturePhotoButton");

        capturePhotoButton.addEventListener("click",
            function () {

                //    resetControls();

                that._pictureSource = navigator.camera.PictureSourceType;
                that._destinationType = navigator.camera.DestinationType;
                that._capturePhoto.apply(that, arguments);
            });

        //RRP: boton captura placa -----------------------------

        that.resultsField = document.getElementById("result");

        scanButton.addEventListener("click",
            function () {

                //document.getElementById("smallImage").style.display = 'none';
               // document.getElementById("smallImage").style.visibility = 'hidden';
                //document.getElementById("result").style.visibility = 'hidden';
                //document.getElementById("vehiculo").style.visibility = 'hidden';

                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";


                resetControls("");

                that._scan.call(that);
            });
    },

    _scan: function () {
        var that = this;
        try {
            if (window.navigator.simulator === true) {

                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";

                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Aplicaci\u00F3n no compatible.");
            } else {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            that._addMessageToLog(result.format, result.text);
                        }
                    },
                    function (error) {
                        // ERROR: SCAN  is already in progress   
                        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se realiz\u00F3 el escaneo. Intentelo nuevamente.");

                    });
            }
        } catch (e) {
            alert(e);
        }
    },

    _addMessageToLog: function (format, text) {
        //var that = this,
        //    currentMessage = that.resultsField.innerHTML,
        //    html = '<input type="text" id="txtResPlaca" value="' + text + '"/>';
        //that.resultsField.innerHTML = html;



        TraerInformacion(text, "C");
    },

    //-------------------------------------------

    _capturePhoto: function () {
        var that = this;

        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function () {
            that._onPhotoDataSuccess.apply(that, arguments);
        }, function () {
            that._onFail.apply(that, arguments);
        }, {
            //quality: 100,
            //targetWidth: 1000,
            //targetHeight: 500,
            

            quality: 100,
            targetWidth: 1280,
            targetHeight: 720,
      //      encodingType: Camera.encodingType.PNG,

        //    allowEdit: true,
            destinationType: that._destinationType.FILE_URI,

            //   destinationType: that._destinationType.DATA_URL,
            correctOrientation: true,
            saveToPhotoAlbum: true // RRP: Guarda la imagen en el album
        });
    },

    //----------------------------------------
    // Captura la imagen y la presenta en tipo PATH
    //----------------------------------------
    _onPhotoDataSuccess: function (imageURI) {

      //  alert("tomada2");

        resetControls("");

        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
        smallImage.style.visibility = 'visible';
        // Show the captured photo.
        smallImage.src = imageURI;
        uploadPhoto(imageURI);
    },


    //----------------------------------------
    // Captura la imagen y la presenta en tipo BASE64
    //----------------------------------------
    //_onPhotoDataSuccess: function (imageData) {
    //    var smallImage = document.getElementById('smallImage');
    //    smallImage.style.display = 'block';

    //    smallImage.style.visibility = 'visible';
    //    // Show the captured photo.
    //    smallImage.src = "data:image/jpeg;base64," + imageData;
    //  //  document.getElementById("smallImage").style.visibility = 'visible';
    //},


    _onFail: function (message) {



        // no se tomo la foto
        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se ha guardado ninguna imagen. Intentelo nuevamente.");
    }

}



function buscaPlacaVIN(placaVIN) {

    resetControls("");

    // loading
    document.getElementById("divLoading").innerHTML = "";
    // Borrar imagen de placa
    document.getElementById("smallImage").style.display = "none";


    if (document.getElementById('infoPlacasVIN').value != "") {

        if (placaVIN.length > 8) {

            var patron = /^\d*$/;
            if (patron.test(placaVIN))
            {
                TraerInformacion(placaVIN, "O");
            } 
            else
            {
                TraerInformacion(placaVIN, "C");
            }

           // TraerInformacion(placaVIN, "C");
        }
        else
        {
            var strPlaca = placaVIN;
            TraerInformacion(strPlaca, "P");
        }
    }
    else {

        // loading
        document.getElementById("divLoading").innerHTML = "";
        // Borrar imagen de placa
        document.getElementById("smallImage").style.display = "none";
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Placa o VIN");
    }
}


function cboSecciones(selSeccion) {

    //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;TL;SECCIONES;

    var UrlCboSecciones = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2," + localStorage.getItem("ls_idempresa").toLocaleString() + ";TL;SECCIONES;"

    var cboSecResp = "";

    $.ajax({
        url: UrlCboSecciones,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboSecResp = JSON.parse(data.ComboParametroEmpGetResult);
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Secci&oacute;n");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Secci&oacute;n");
            return;
        }
    });

    if (cboSecResp.length > 0) {

        var cboAgenciaHTML = "<p><div class='select-style2'><select id='seccion2'  onchange='cboTrabajos(this.value)' class='w3-input w3-border textos'>";
        for (var i = 0; i < cboSecResp.length; i++) {
            if (selSeccion == cboSecResp[i].CodigoClase)
            {
                cboAgenciaHTML += "<option  value='" + cboSecResp[i].CodigoClase + "' selected>" + cboSecResp[i].NombreClase + "</option>";
            }
            else {
                cboAgenciaHTML += "<option  value='" + cboSecResp[i].CodigoClase + "'>" + cboSecResp[i].NombreClase + "</option>";
            }


        }
        cboAgenciaHTML += "</select></div>";
        document.getElementById("divcboseccion").innerHTML = cboAgenciaHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Secci&oacute;n");
    }
}


function cboTrabajos(itmSeccion, selTrabajo) {

    var cboTrabajoHTML = "<p><select id='trabajo2' onchange='cboMantenimientos(this.value)' class='w3-input w3-border textos'>";
    cboTrabajoHTML += "<option  value=' '>Ninguno</option>";
    cboTrabajoHTML += "</select>";

    if (itmSeccion != "") {
        // var itmSeccion = "COLISION";

        //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ParametroGralGet/1,173
        // var UrlCboTrabajos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/1,173";

        // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/6,1;TL;TIPOS_TRABAJO;;;;;COLISION;

        var UrlCboTrabajos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/6,1;TL;TIPOS_TRABAJO;;;;;" + itmSeccion + ";";

        var cboTrbResp = ""; 

        $.ajax({
            url: UrlCboTrabajos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboTrbResp = JSON.parse(data.ComboParametroEmpGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Trabajo");
                    return;
                }
            },
            error: function (err) {
              //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Trabajo");
                return;
            }
        });


        if (cboTrbResp.length > 0) {

            cboTrabajoHTML = "<p><div class='select-style2'><select id='trabajo2' onchange='cboMantenimientos2(this.value)' class='w3-input w3-border textos'>";
            for (var i = 0; i < cboTrbResp.length; i++) {

                if (cboTrbResp[i].CodigoClase != " " || cboTrbResp[i].CodigoClase != "ninguna") {

                    if (selTrabajo == cboTrbResp[i].CodigoClase) {
                        cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "' selected>" + cboTrbResp[i].NombreClase + "</option>";
                    }
                    else {
                        cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "'>" + cboTrbResp[i].NombreClase + "</option>";
                    }


                }
            }
            cboTrabajoHTML += "</select></div>";
        }
        else {
             cboTrabajoHTML = "<p><select id='trabajo2' class='w3-input w3-border textos'>";
             cboTrabajoHTML += "<option  value=' '>Ninguno</option>";
            cboTrabajoHTML += "</select>";

        }

    }

    document.getElementById("divcboTrabajo").innerHTML = cboTrabajoHTML;

    //else {
    //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Trabajo");
    //}
}


function cboMantenimientos(itmTrabajo, selMantenimiento) {


    var cboMantenimientoHTML = "<p><select id='mantenimiento2'  class='w3-input w3-border textos'>";
    cboMantenimientoHTML += "<option  value=' '>Ninguno</option>";
    cboMantenimientoHTML += "</select>";


    if (itmTrabajo == "MP" || itmTrabajo == "MANTENIMIENTO") {
        //  http://186.71.21.170:8077/taller/Services/GA/Garantias.svc/OperacionesMantGet/1,

        var UrlCboMantenimientos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/GA/Garantias.svc/OperacionesMantGet/1,";

        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlCboMantenimientos);

        var cboMntResp = "";

        $.ajax({
            url: UrlCboMantenimientos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboMntResp = JSON.parse(data.OperacionesMantGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Mantenimiento");
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Mantenimiento");
                return;
            }
        });


        if (cboMntResp.length > 0) {

            var cboMantenimientoHTML = "<p><div class='select-style2'> <select id='mantenimiento2'  class='w3-input w3-border textos'>";
            for (var i = 0; i < cboMntResp.length; i++) {

                if ("000 Km. (" + selMantenimiento + ")" == cboMntResp[i].CodigoClase) {
                    cboMantenimientoHTML += "<option  value='" + cboMntResp[i].CodigoClase + "' selected>" + cboMntResp[i].NombreClase + "</option>";
                }
                else {
                    cboMantenimientoHTML += "<option  value='" + cboMntResp[i].CodigoClase + "'>" + cboMntResp[i].NombreClase + "</option>";
                }
            }
            cboMantenimientoHTML += "</select></div>";
         
        }
        else {

            cboMantenimientoHTML = "<p><select id='mantenimiento2' class='w3-input w3-border textos'>";
            cboMantenimientoHTML += "<option  value=' '>Ninguno</option>";
            cboMantenimientoHTML += "</select>";


           // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Mantenimiento");
        }
    }
    document.getElementById("divcboMantenimiento").innerHTML = cboMantenimientoHTML;

}


//_________________________________________________________


function cboMantenimientos2(itmTrabajo, selMantenimiento) {

    var cboMantenimientoHTML = "<p><select id='mantenimiento2'  class='w3-input w3-border textos'>";
    cboMantenimientoHTML += "<option  value=' '>Ninguno</option>";
    cboMantenimientoHTML += "</select>";

    if (itmTrabajo == "MP" || itmTrabajo == "MANTENIMIENTO") {
        //  http://186.71.21.170:8077/taller/Services/GA/Garantias.svc/OperacionesMantGet/1,

        var UrlCboMantenimientos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/GA/Garantias.svc/OperacionesMantGet/1,";

        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlCboMantenimientos);

        var cboMntResp = "";

        $.ajax({
            url: UrlCboMantenimientos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboMntResp = JSON.parse(data.OperacionesMantGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Mantenimiento");
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Mantenimiento");
                return;
            }
        });


        if (cboMntResp.length > 0) {

            $.ajax({
                url: UrlCboMantenimientos,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        cboMntResp = JSON.parse(data.OperacionesMantGetResult);
                    } catch (e) {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Mantenimiento");
                        return;
                    }
                },
                error: function (err) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Mantenimiento");
                    return;
                }
            });

            //  alert(inspeccionar(cboMntResp[0]));

            $("#mantenimiento2_cbo").kendoComboBox({
                placeholder: "Ninguno",
                dataTextField: "NombreClase",
                dataValueField: "CodigoClase",
                dataSource: cboMntResp,
                select: onSelectMant,
            });

            var combobox = $("#mantenimiento2_cbo").data("kendoComboBox");

        //    alert(selMantenimiento);

            combobox.value("000 Km. (" + selMantenimiento + ")");

            document.getElementById("mantenimiento2_hidden").value = "000 Km. (" + selMantenimiento + ")";


        }
        else {

            alert("sin rel");

            $("#mantenimiento2_cbo").kendoComboBox({
                placeholder: "Ninguno",
                dataSource: ["Ninguno"]
            });

            var combobox = $("#mantenimiento2_cbo").data("kendoComboBox");
            document.getElementById("mantenimiento2_hidden").value = " ";
        }
    }
   // document.getElementById("divcboMantenimiento").innerHTML = cboMantenimientoHTML;

}


function onSelectMant(e) {
    var dataItem = this.dataItem(e.item.index());
    document.getElementById("mantenimiento2_hidden").value = dataItem.CodigoClase;
};


//_________________________________________________________


function cboPaises(selPais) {

    //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ParametroGralGet/1,18

    var UrlCboPaises = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/1,18"

  //  alert(UrlCboPaises);

    var cboPaResp = "";

    $.ajax({
        url: UrlCboPaises,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboPaResp = JSON.parse(data.ParametroGralGetResult);
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
            return;
        }
    });



    if (cboPaResp.length > 0) {

        var cboPaisHTML = "<p><select id='pais2' onchange='cboCiudades(this.value)' class='w3-input w3-border textos'>";

     

        for (var i = 0; i < cboPaResp.length; i++) {
            if (selPais == cboPaResp[i].CodigoClase) {
                cboPaisHTML += "<option  value='" + cboPaResp[i].CodigoClase + "' selected>" + cboPaResp[i].NombreClase + "</option>";
            }
            else {
                cboPaisHTML += "<option  value='" + cboPaResp[i].CodigoClase + "'>" + cboPaResp[i].NombreClase + "</option>";
            }
            

        }
        cboPaisHTML += "</select>";
        document.getElementById("divcboPais").innerHTML = cboPaisHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
    }
}


function cboCiudades(itmPais, selCiudad) {

   // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/CiudadesGet/1,ECUADOR


        var cboCiudadHTML = "<p><select id='ciudad2' onchange='cboMantenimientos(this.value)' class='w3-input w3-border textos'>";
    cboCiudadHTML += "<option  value=' '>Ninguna</option>";
    cboCiudadHTML += "</select>";

    if (itmPais != "") {


        var UrlCboCiudades = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/CiudadesGet/1," + itmPais;

        var cboCiuResp = "";

        $.ajax({
            url: UrlCboCiudades,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboCiuResp = JSON.parse(data.CiudadesGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                    return;
                }
            },
            error: function (err) {
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                return;
            }
        });


        if (cboCiuResp.length > 0) {

            cboCiudadHTML = "<p><select id='ciudad2' class='w3-input w3-border textos'>";
            for (var i = 0; i < cboCiuResp.length; i++) {

                if (cboCiuResp[i].CodigoClase != " " || cboCiuResp[i].CodigoClase != "ninguna") {
                    if (selCiudad == cboCiuResp[i].CodigoClase) {
                        cboCiudadHTML += "<option  value='" + cboCiuResp[i].CodigoClase + "' selected>" + cboCiuResp[i].NombreClase + "</option>";

                    }
                    else {
                        cboCiudadHTML += "<option  value='" + cboCiuResp[i].CodigoClase + "'>" + cboCiuResp[i].NombreClase + "</option>";

                    }

                }
            }
            cboCiudadHTML += "</select>";
        }
        else {
            cboCiudadHTML = "<p><select id='ciudad2' class='w3-input w3-border textos'>";
            cboCiudadHTML += "<option  value=' '>Ninguna</option>";
            cboCiudadHTML += "</select>";

        }

    }

    document.getElementById("divcboCiudad").innerHTML = cboCiudadHTML;

    //else {
    //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
    //}
}


function cboPagos(selPago) {

    var arrPago = ["NINGUNA", "EFECTIVO", "CHEQUE", "TARJETA", "CREDITO"];

    var cboAgenciaHTML = "<p><select id='fpago' class='w3-input w3-border textos'>";
    for (var i = 0; i < arrPago.length; i++) {
        if (selPago == arrPago[i]) {
            cboAgenciaHTML += "<option  value='" + arrPago[i] + "' selected>" + arrPago[i] + "</option>";
        }
        else {
            cboAgenciaHTML += "<option  value='" + arrPago[i] + "'>" + arrPago[i] + "</option>";
        }
    }
    cboAgenciaHTML += "</select>";
    document.getElementById("divcboPago").innerHTML = cboAgenciaHTML;
}


function cboCarga(idCombo, arrCombo, selItem, divCombo) {
   // var arrCombo = ["NINGUNA", "EFECTIVO", "CHEQUE", "TARJETA", "CREDITO"];

    var cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos'>";
    for (var i = 0; i < arrCombo.length; i++) {
        if (selItem == arrCombo[i]) {
            cboAgenciaHTML += "<option  value='" + arrCombo[i] + "' selected>" + arrCombo[i] + "</option>";
        }
        else {
            cboAgenciaHTML += "<option  value='" + arrCombo[i] + "'>" + arrCombo[i] + "</option>";
        }
    }
    cboAgenciaHTML += "</select>";
    document.getElementById(divCombo).innerHTML = cboAgenciaHTML;
}

/*--------------------------------------------------------------------
Fecha: 16/08/2017
Detalle: Obtiene la informacion a traves del Chasis
Autor: RRP
--------------------------------------------------------------------*/
function TraerInformacion(responseText, tipo) {

    // Presenta el primer item del tabtrip
    var tabstrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
    tabstrip.select(0);

    document.getElementById('infoPlacasVIN').value = responseText;

  //  alert(responseText);

    var intResult = 0;

    try {

        var Url = "";

        // http://186.71.21.170:8077/taller/Services/TL/Taller.svc/tl06OrdenesGet/1,json;1;;;PCT7242;
        // http://186.71.21.170:8077/taller/Services/TL/Taller.svc/tl06OrdenesGet/4,xml;1;01;01;;;;;;201703024;


        if (tipo == "P")
        {
            // Placa
            Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";;;" + responseText + ";";
        } else if (tipo == "C")
        {
            // Chasis
            Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";;;;" + responseText;
        }
        else
        {
            // OT
            Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";;;;;;" + responseText + ";";

        }

     //   alert(Url);

        var infor;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {

                    //  alert(inspeccionar(data));
                    infor = (JSON.parse(data.tl06OrdenesGetResult)).ttl06[0];
                    //  alert(infor.placa);
                    //   intResult = 1;

                } catch (e) {

                    // loading
                    document.getElementById("divLoading").innerHTML = "";
                    // Borrar imagen de placa
                    document.getElementById("smallImage").style.display = "none";

                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos del \nC\u00F3digo: " + responseText);
                    return;
                }
            },
            error: function (err) {

                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";

                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                return;
            }
        });

        // Usuario crea => login actual
        document.getElementById("usuario_creacion").value = localStorage.getItem("ls_usulog").toLocaleString();

       var arrPago = ["NINGUNA", "EFECTIVO", "CHEQUE", "TARJETA", "CREDITO"];
       var arrTipPers = ["NATURAL", "JURIDICA"];
       var arDoc = ["CEDULA", "RUC", "PASAPORTE"];
       var arrDir = ["DOMICILIO", "TRABAJO"];

        if (tipo == "O") {
            // Usuario modif  => db
            document.getElementById("usuario_modificacion").value = infor.usuario_modificacion;

            document.getElementById("km").value = infor.kilometraje;
            document.getElementById("numOT").value = responseText;
            document.getElementById("chofer").value = infor.nombre_entrega_auto;
            document.getElementById("reparaciones").value = infor.reparaciones_solicitadas;
            document.getElementById("observaciones").value = infor.observacion;

            // Info Orden de trabajo
            document.getElementById("numOT").value = responseText;
            document.getElementById("divInfOT").style.display = "block";
            document.getElementById("divInfOT").style.visibility = "visible";

            // Cbo. Seccion
            cboSecciones(infor.seccion_orden_trabajo.toUpperCase());
            // Cbo. Seccion
            cboSecciones("MECANICA");
            // Tipo trabajo
            cboTrabajos(document.getElementById("seccion2").value, infor.tipo_trabajo);
            // Mantenimiento
            cboMantenimientos(document.getElementById("trabajo2").value, infor.tipo_mantenimiento);

            cboMantenimientos2(document.getElementById("trabajo2").value, infor.tipo_mantenimiento);



            // Cbo. forma de pago
          //  cboPagos(infor.forma_pago_esperada.toUpperCase());

            cboCarga("fpago", arrPago, infor.forma_pago_esperada.toUpperCase(), "divcboPago");

        //    alert(infor.cual_tarjeta_credito);

            document.getElementById("num_tarjeta").value = infor.cual_tarjeta_credito;

            document.getElementById("anio2").value = infor.anio;
            document.getElementById("secuencia_orden2").value = infor.secuencia_orden;


            document.getElementById("btnGuardaInfo").innerHTML = " <button onclick='registrarOT();' class='w3-btn w3-red'>MODIFICAR OT</button>";

        }
        else {
            // Usuario modif => login actual
            document.getElementById("usuario_modificacion").value = localStorage.getItem("ls_usulog").toLocaleString();

            document.getElementById("km").value = ""; // infor.kilometraje;
            document.getElementById("numOT").value = "";
            document.getElementById("chofer").value = "";
            document.getElementById("reparaciones").value = ""; // infor.reparaciones_solicitadas;
            document.getElementById("observaciones").value = "";

            //// Info Orden de trabajo
            //document.getElementById("numOT").value = "";
            //document.getElementById("divInfOT").style.display = "none";

            // Cbo. Seccion
            cboSecciones("MECANICA");
            // Tipo trabajo
            cboTrabajos(document.getElementById("seccion2").value, "MANTENIMIENTO");
            // Mantenimiento
            cboMantenimientos(document.getElementById("trabajo2").value, " ");


           cboMantenimientos2(document.getElementById("trabajo2").value, " ");


            // Cbo. forma de pago
            cboCarga("fpago", arrPago, "NINGUNA", "divcboPago");

            document.getElementById("num_tarjeta").value = "";

            document.getElementById("btnGuardaInfo").innerHTML = " <button onclick='registrarOT();' class='w3-btn w3-red'>GENERAR OT</button>";

        }

        document.getElementById("placa").value = infor.placa;
        document.getElementById("chasis").value = infor.chasis;
        document.getElementById("codigo_marca").value = infor.codigo_marca;
        document.getElementById("mi_modelo").value = infor.nombre_modelo;//codigo_modelo;
        document.getElementById("anio_modelo").value = infor.anio;
        document.getElementById("nombre_color").value = infor.color_vehiculo;

        //document.getElementById("seccion").value = "";

     //   document.getElementById("tipo").value = infor.tipo_trabajo;

        //document.getElementById("mant").value = "";
    //    document.getElementById("km").value = ""; // infor.kilometraje;
        document.getElementById("nombre_propietario").value = infor.nombre_propietario;

        

        //document.getElementById("reparaciones").value = ""; // infor.reparaciones_solicitadas;
        //document.getElementById("observaciones").value = "";
        document.getElementById("pais").value = infor.pais_cliente;


        document.getElementById("ciudad_propietario").value = infor.ciudad_cliente;
        document.getElementById("calle_principal_propietario").value = infor.calle_cliente;
        document.getElementById("numero_calle_propietario").value = infor.numero_calle;
        document.getElementById("calle_interseccion_propieta").value = infor.calle_interseccion;
        document.getElementById("telefono_propietario").value = infor.telefono_cliente;
        document.getElementById("tipo_dir_propietario").value = infor.direccion_cliente;

        document.getElementById("numero_id_propietario").value = infor.identifica_cliente;
        document.getElementById("persona_numero").value = infor.persona_numero;

        var arrNombre = infor.nombre_cliente.split(",");
        document.getElementById("persona_apellido").value = arrNombre[0];
        document.getElementById("persona_apellido2").value = arrNombre[1];

        if (arrNombre.length > 2) {
            document.getElementById("persona_nombre").value = arrNombre[2];
            document.getElementById("persona_nombre2").value = arrNombre[3];
        }
        else {

            document.getElementById("persona_nombre").value = "";
            document.getElementById("persona_nombre2").value = "";
        }

        document.getElementById("mail").value = infor.email_cliente;
        document.getElementById("telefono_celular").value = infor.celular_cliente;
      //  document.getElementById("cli_pais").value = document.getElementById("pais").value;
      //  document.getElementById("cli_ciudad_propietario").value = document.getElementById("ciudad_propietario").value;
        document.getElementById("cli_calle_principal_propietario").value = document.getElementById("calle_principal_propietario").value;
        document.getElementById("cli_numero_calle_propietario").value = document.getElementById("numero_calle_propietario").value;
        document.getElementById("cli_calle_interseccion_propieta").value = document.getElementById("calle_interseccion_propieta").value;
        document.getElementById("cli_telefono_propietario").value = document.getElementById("telefono_propietario").value;

        document.getElementById("autorizadoPor").value = infor.nombre_autoriza_trabajo;


        /* -----------------------
Info Orden de Trabajo  
-------------------------*/
        $("#dpInicio").kendoDatePicker({
            format: "dd-MM-yyyy",
        });


        $("#dpFin").kendoDatePicker({
            format: "dd-MM-yyyy",
        });

        // Pais
        
        cboPaises(infor.pais_cliente);

       //    cboPaises("ECUADOR");

        // Ciudad
           cboCiudades(document.getElementById("pais2").value, infor.ciudad_cliente);

        // Cbo. Tipo persona
        cboCarga("tpers", arrTipPers, infor.persona_tipo.toUpperCase(), "divcbotpers");

        // Cbo. Tipod de documento
        cboCarga("tid", arDoc, infor.tipo_id_cliente.toUpperCase(), "divcbotid");

        //// Cbo. tipo direccion
        cboCarga("direc", arrDir, infor.direccion_cliente.toUpperCase(), "divcbodirec");



       // var arrTcred = ["DINERS", "VISA","MASTERCARD","AMERICAN EXPRESS", "DISCOVER" ];
       // cboCarga("ftcred", arrTcred, arrTcred[0], "divcboTcred");


        // campos ocultos---------------------------------

        document.getElementById("codigo_modelo2").value = infor.codigo_modelo;

        document.getElementById("anio_cotizacion").value = infor.anio_cotizacion;
        document.getElementById("anio_modelo").value = infor.anio_modelo;
        document.getElementById("area_fiscal").value = infor.area_fiscal;

        document.getElementById("codigo_sucursal").value = localStorage.getItem("ls_ussucursal").toLocaleString(); // infor.codigo_sucursal;

        document.getElementById("codigo_taller").value = localStorage.getItem("ls_usagencia").toLocaleString(); // infor.codigo_taller;

     //   alert(document.getElementById("codigo_taller").value);  //rrp taller

        document.getElementById("enviado_distribuidor").value = infor.enviado_distribuidor;
        document.getElementById("estado").value = infor.estado;
        document.getElementById("fecha_anulacion").value = infor.fecha_anulacion;
        document.getElementById("fecha_cancelacion").value = infor.fecha_cancelacion;
        document.getElementById("fecha_creacion").value = infor.fecha_creacion;
        document.getElementById("fecha_facturacion").value = infor.fecha_facturacion;
        document.getElementById("fecha_informe_tecnico").value = infor.fecha_informe_tecnico;
        document.getElementById("fecha_inicio").value = infor.fecha_inicio;
        document.getElementById("fecha_liquidacion").value = infor.fecha_liquidacion;
        document.getElementById("fecha_modificacion").value = infor.fecha_modificacion;
        document.getElementById("fecha_ofrece").value = infor.fecha_ofrece;
        document.getElementById("fecha_real_entrega").value = infor.fecha_real_entrega;
        document.getElementById("fecha_recepcion").value = infor.fecha_recepcion;
        document.getElementById("fecha_retiene_envio").value = infor.fecha_retiene_envio;
        document.getElementById("hora_anulacion").value = infor.hora_anulacion;
        document.getElementById("hora_cancelacion").value = infor.hora_cancelacion;
        document.getElementById("hora_creacion").value = infor.hora_creacion;
        document.getElementById("hora_facturacion").value = infor.hora_facturacion;
        document.getElementById("hora_informe_tecnico").value = infor.hora_informe_tecnico;
        document.getElementById("hora_inicio").value = infor.hora_inicio;
        document.getElementById("hora_liquidacion").value = infor.hora_liquidacion;
        document.getElementById("hora_modificacion").value = infor.hora_modificacion;
        document.getElementById("hora_ofrece").value = infor.hora_ofrece;
        document.getElementById("hora_real_entrega").value = infor.hora_real_entrega;
        document.getElementById("hora_recepcion").value = infor.hora_recepcion;
        document.getElementById("hora_retiene_envio").value = infor.hora_retiene_envio;
        document.getElementById("nivel_gasolina").value = infor.nivel_gasolina;
        document.getElementById("nombre_cliente").value = infor.nombre_cliente;
        document.getElementById("numero_cono").value = infor.numero_cono;
        document.getElementById("numero_cotizacion").value = infor.numero_cotizacion;
        document.getElementById("numero_motor").value = infor.numero_motor;
        document.getElementById("numero_orden").value = infor.numero_orden;
        document.getElementById("numero_poliza").value = infor.numero_poliza;
        document.getElementById("numero_siniestro").value = infor.numero_siniestro;
        document.getElementById("observacion_cancelacion").value = infor.observacion_cancelacion;
        document.getElementById("observacion_tecnica").value = infor.observacion_tecnica;
        document.getElementById("persona_clase").value = infor.persona_clase;
        document.getElementById("persona_nombre_mecanico").value = infor.persona_nombre_mecanico;
        document.getElementById("persona_numero_aseguradora").value = infor.persona_numero_aseguradora;
        document.getElementById("persona_numero_control").value = infor.persona_numero_control;
        document.getElementById("persona_numero_garantia").value = infor.persona_numero_garantia;
        document.getElementById("persona_numero_mecanico").value = infor.persona_numero_mecanico;
        document.getElementById("persona_numero_recepta").value = infor.persona_numero_recepta;
        document.getElementById("prog_cancelacion").value = infor.prog_cancelacion;
        document.getElementById("prog_creacion").value = infor.prog_creacion;
        document.getElementById("prog_modificacion").value = infor.prog_modificacion;
        document.getElementById("referencia_srg").value = infor.referencia_srg;
        document.getElementById("retener_envio").value = infor.retener_envio;
        document.getElementById("secuencia_control").value = infor.secuencia_control;
        document.getElementById("secuencia_cotizacion").value = infor.secuencia_cotizacion;
        document.getElementById("secuencia_fisica_aut").value = infor.secuencia_fisica_aut;
        document.getElementById("secuencia_orden").value = infor.secuencia_orden;
        document.getElementById("secuencia_recepta").value = infor.secuencia_recepta;
        document.getElementById("tiene_terceros").value = infor.tiene_terceros;
        document.getElementById("tipo_mantenimiento").value = infor.tipo_mantenimiento;
        document.getElementById("tipo_registro_aseguradora").value = infor.tipo_registro_aseguradora;
        document.getElementById("usuario_anulacion").value = infor.usuario_anulacion;
        document.getElementById("usuario_cancelacion").value = infor.usuario_cancelacion;



        //document.getElementById("usuario_creacion").value = infor.usuario_creacion;
        //document.getElementById("usuario_modificacion").value = infor.usuario_modificacion;


        document.getElementById("usuario_informe_tecnico").value = infor.usuario_informe_tecnico;
        document.getElementById("usuario_retiene_envio").value = infor.usuario_retiene_envio;
        document.getElementById("valor_autoriza_aseguradora").value = infor.valor_autoriza_aseguradora;
        document.getElementById("valor_autoriza_cliente").value = infor.valor_autoriza_cliente;
        document.getElementById("color_cono").value = infor.color_cono;
        document.getElementById("viene_de_cita").value = infor.viene_de_cita;
        document.getElementById("requiere_taxi").value = infor.requiere_taxi;
        document.getElementById("eleva_vehiculo").value = infor.eleva_vehiculo;
        document.getElementById("persona_numero_comercial").value = infor.persona_numero_comercial;
        document.getElementById("persona_nombre_comercial").value = infor.persona_nombre_comercial;
        document.getElementById("sobreturno").value = infor.sobreturno;
        document.getElementById("cerro_costo_tintes").value = infor.cerro_costo_tintes;
        document.getElementById("cita_retorno").value = infor.cita_retorno;
        document.getElementById("presupuesto_previo").value = infor.presupuesto_previo;
        document.getElementById("ot_revisada").value = infor.ot_revisada;
        document.getElementById("explica_cliente").value = infor.explica_cliente;
        document.getElementById("transmitido_af").value = infor.transmitido_af;
        document.getElementById("fecha_cita").value = infor.fecha_cita;
        document.getElementById("hora_cita").value = infor.hora_cita;
        document.getElementById("clave_af").value = infor.clave_af;
        document.getElementById("agencia_af").value = infor.agencia_af;
        document.getElementById("asesor_af").value = infor.asesor_af;

        //----------------------------------

       ConsultarEM(infor.chasis)
       ConsultarOT(infor.chasis, document.getElementById("dpInicio").value, document.getElementById("dpFin").value);

    //    ConsultarOT2(infor.chasis, document.getElementById("dpInicio").value, document.getElementById("dpFin").value);


    //    verOT(infor.chasis, document.getElementById("dpInicio").value, document.getElementById("dpFin").value);

        // loading
        document.getElementById("divLoading").innerHTML = "";
        // Borrar imagen de placa
        document.getElementById("smallImage").style.display = "none";

        document.getElementById("result").style.visibility = 'visible';
        document.getElementById("vehiculo").style.visibility = 'visible';
        document.getElementById("tabstrip").style.visibility = 'visible';

    } catch (e1) {


        resetControls("");

      //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");


      //  alert(e1);
    }

}


/*--------------------------------------------------------------------
Fecha: 11/09/2017
Descripcion: Informacion del cliente
Parametros: identificacion
--------------------------------------------------------------------*/
function ConsultarCliente(identificacion) {
    try {

        document.getElementById("persona_numero").value = "";
        document.getElementById("mail").value = "";
        document.getElementById("persona_nombre").value = "";
        document.getElementById("persona_nombre2").value = "";
        document.getElementById("persona_apellido").value = "";
        document.getElementById("persona_apellido2").value = "";


        document.getElementById("cli_calle_principal_propietario").value = "";
        document.getElementById("cli_numero_calle_propietario").value = "";
        document.getElementById("cli_calle_interseccion_propieta").value = "";
        document.getElementById("telefono_celular").value = "";
        document.getElementById("cli_telefono_propietario").value = "";
        document.getElementById("mail").value = "";
        document.getElementById("autorizadoPor").value = "";




        if (identificacion != "") {

            var Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/json/" + identificacion;

            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {

                        data = JSON.parse(data.PersonaGetResult);
                        if (data.persona_nombre) {

                            //"persona_nombre" :  "MYRIAN CECILIA", 
                            //"persona_apellido" : "MOREJON CEVALLOS", 
                            //"mail" : "myriam_morejon@yahoo.com", 
                            //"fecha_nacimiento" : "1963-9-13", 
                            //"telefono_celular" : "", 
                            //"persona_numero" : "53446"} ;

                            document.getElementById("persona_numero").value = data.persona_numero;
                            document.getElementById("mail").value = data.mail;

                            var arrNombre = data.persona_nombre.split(" ");

                            if (arrNombre.length > 0) {
                                document.getElementById("persona_nombre").value = arrNombre[0];
                                document.getElementById("persona_nombre2").value = arrNombre[1];
                            }
                            else {
                                document.getElementById("persona_nombre").value = data.persona_nombre;
                                document.getElementById("persona_nombre2").value = "";
                            }

                            var arrApellido = data.persona_apellido.split(" ");
                            if (arrApellido.length > 0) {
                                document.getElementById("persona_apellido").value = arrApellido[0];
                                document.getElementById("persona_apellido2").value = arrApellido[1];
                            }
                            else {
                                document.getElementById("persona_apellido").value = data.persona_apellido;
                                document.getElementById("persona_apellido2").value = "";
                            }

                        } else {

                            document.getElementById("numero_id_propietario").value = "";

                            // Pais
                            cboPaises("ECUADOR");

                            // Ciudad
                            cboCiudades(document.getElementById("pais2").value);

                            //// Cbo. tipo direccion
                            var arrDir = ["DOMICILIO", "TRABAJO"];
                            cboCarga("direc", arrDir, arrDir[0], "divcbodirec");


                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen datos del documento:&nbsp;" + identificacion);

                            return;
                        }
                    } catch (e) {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                        return;
                    }
                },
                error: function (err) {
                    return;
                }
            });
        }
        else {

            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese el N&uacute;mero de C&eacute;dula");
            return;
        }
    } catch (e) {
        return;
    }
}

/*--------------------------------------------------------------------
Fecha: 20/09/2017
Descripcion: Estado de Mantenimiento
Parametros: VIN, Fecha inicio, Fecha fin
--------------------------------------------------------------------*/
function ConsultarEM(emvin) {
    try {

        var erroresEM = 0;

        document.getElementById("tablaPrmEM").style.display = "none";
        document.getElementById("tableEM").style.display = "none";
        document.getElementById("fecEM").value = "";
        document.getElementById("kmEM").value = "";

        var UrlEM = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + "2," + emvin;

        var inforEM;
        $.ajax({
            url: UrlEM,
            type: "GET",
            async: false,
            dataType: "json", 
            success: function (data) {
                try {
                    inforEM = (JSON.parse(data.MantenimientoGetResult)).KilometrajeOT;

                    // alert(inspeccionar(data));

                } catch (e) {

                    // loading
                    document.getElementById("divLoading").innerHTML = "";
                    // Borrar imagen de placa
                    document.getElementById("smallImage").style.display = "none";
                    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos del Estado de Mantenimiento");

                    for (var i = 0; i < 30; i++) {

                        document.getElementById("cl" + inforEM[i].codigo).style.background = "red";
                        document.getElementById("cx" + inforEM[i].codigo + "x").style.display = "";
                        bandera = "rojo";

                    }
                    document.getElementById("fecEM").value = "";
                    document.getElementById("kmEM").value = "";

                    // Si hay error
                    erroresEM = 1;

                    return;
                }
            },
            error: function (err) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";
           //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Estado de Mantenimiento. Int\u00E9ntelo nuevamente.");
                return;
            }
        });

   //     alert(inforEM.length);

    

        if (erroresEM == 0) {
            for (var i = 0; i < 30; i++) {
                document.getElementById("cl" + inforEM[i].codigo).style.background = "transparent";
                document.getElementById("cx" + inforEM[i].codigo + "v").style.display = "none";
                document.getElementById("cx" + inforEM[i].codigo + "x").style.display = "none";

            }


            var bandera = "verde";

            if (inforEM.length > 0) {
                for (var i = 0; i < inforEM.length; i++) {

                    if (i < 30) {
                        if (inforEM[i].validacion == true) {
                            document.getElementById("cl" + inforEM[i].codigo).style.background = "green";
                            document.getElementById("cx" + inforEM[i].codigo + "v").style.display = "";

                        }
                        else {
                            document.getElementById("cl" + inforEM[i].codigo).style.background = "red";
                            document.getElementById("cx" + inforEM[i].codigo + "x").style.display = "";
                            bandera = "rojo";
                        }
                    }
                    if (inforEM[i].ultimo == true) {
                        //alert(inforEM[i].fecha_kilometraje);
                        //alert(inforEM[i].kilometraje);
                        document.getElementById("fecEM").value = inforEM[i].fecha_kilometraje;
                        document.getElementById("kmEM").value = inforEM[i].kilometraje;
                        break;
                        // i = 30;
                    }
                }

                document.getElementById("tablaPrmEM").style.display = "block";
                document.getElementById("tableEM").style.display = "block";

            }

        }

       

    } catch (e) {
        // loading
        document.getElementById("divLoading").innerHTML = "";
        // Borrar imagen de placa
        document.getElementById("smallImage").style.display = "none";
   //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Estado de Mantenimiento. Int\u00E9ntelo nuevamente.");
        return;
    }
}


/*--------------------------------------------------------------------
Fecha: 18/08/2017
Descripcion: Orden de Trabajo
Parametros: VIN, Fecha inicio, Fecha fin
--------------------------------------------------------------------*/
function ConsultarOT(strVIN, datFecIni, datFecFin) {
    try {


        document.getElementById("tablaOT").style.display = "none";
        document.getElementById("datosOT").style.display = "none";


        var respOT = "0";

        // var usu = localStorage.getItem("Inp_DatosUsuario");
        //  var UrlOrdenTrab = wsInfoVehiculo + "/Ordenes/1,2," + strVIN + "," + datFecIni + "," + datFecFin; // urlService + "Ordenes/" + "1,2," + datos_Cliente.chasis + "," + document.getElementById("FechaInicio").value + "," + document.getElementById("FechaFin").value;

        var UrlOrdenTrab = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Ordenes/1,2," + strVIN + "," + datFecIni + "," + datFecFin;

        //    alert(UrlOrdenTrab);

        var infOrden;
        $.ajax({
            url: UrlOrdenTrab,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infOrden = (JSON.parse(data.OrdenesGetResult)).CabeceraOT01;
                    respOT = "1";
                } catch (e) {

                    // loading
                    document.getElementById("divLoading").innerHTML = "";
                    // Borrar imagen de placa
                    document.getElementById("smallImage").style.display = "none";
                 //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos de Orden de Trabajo");
                    return;
                }
            },
            error: function (err) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";
                //      window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Orden de Trabajo. Int\u00E9ntelo nuevamente.");
                return;
            }
        });


        if (respOT == "1") {
            var obs = (screen.width * 9) / 100;
            var fecha = (screen.width * 14) / 100;
            var ot = (screen.width * 17) / 100;
            var taller = (screen.width * 12) / 100;

            var registro;
            var banderaOT;


            registro = "";


            $("#datosOT").kendoGrid({
                dataSource: {
                    data: infOrden,
                    //schema: {
                    //    model: {
                    //        fields: {
                    //            fecha_recepcion: { type: "string" },
                    //            numero_ot: { type: "string" },
                    //            nombre_taller: { type: "string" },
                    //            kilometraje: { type: "string" },
                    //            observacion: { type: "string" }
                    //        }
                    //    }
                    //},
                    pageSize: 20
                },




                height: 500,
                scrollable: true,
                pageable: {
                    input: true,
                    numeric: false
                },
                columns: [
                     //{
                     //    command: { text: "ver", click: showDetails, template: "<input type='image' src='../../kendo/styles/images/detail.png' title='Obs.'/>" }, title: " ", width: "70px",
                     //},

                      {
                          width: obs,
                          command: [{
                              text: "ver",

                              click: function (e) {
                                  try {
                                      var grid = $("#datosOT").data("kendoGrid");
                                      var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
                                      e.preventDefault();

                                      var UrlDetalleOTEnvia = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Detalle/" + dataItem.codigo_empresa + "," + dataItem.anio_ga35 + "," + dataItem.secuencia_orden;

                                      localStorage.setItem("ls_urldetot", UrlDetalleOTEnvia);
                                      localStorage.setItem("ls_nomtall", dataItem.nombre_taller);
                                      localStorage.setItem("ls_otobs", dataItem.observacion);

                                      kendo.mobile.application.navigate("components/detalle_ot/view.html");

                                  } catch (f) {
                                      //mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                                      //   "OBSERVACION", "<span align='justify'>" + f + "</b></span>", true, true);

                                  }
                              }
                          }],
                      },



                    { field: "fecha_recepcion", title: "Fecha", width: fecha },
                    { field: "numero_ot", title: "No.OT", width: ot },
                    { field: "nombre_taller", title: "Taller", width: "150px" },
                    { field: "kilometraje", title: "Km.",  width: "80px" },
                 //   { field: "observacion", title: "Obs." }

                                      {
                                          title: "Obs", width: obs,
                                          command: [{
                                              text: "o",
                                              visible: function (dataItem) { return dataItem.observacion != "0," },
                                              click: function (e) {
                                                  try {
                                                      e.preventDefault();
                                                      banderaOT = 1;
                                                      var tr = $(e.target).closest('tr');
                                                      var dataItem = this.dataItem(tr);

                                                      var arrObservacion = dataItem.observacion.split(",");

                                                      window.myalert("<center><i class=\"fa fa-ambulance\"></i> <font style='font-size: 14px'>OBSERVACIONES</font></center>", arrObservacion[1]);

                                                  } catch (f) {
                                                      //mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                                                      //   "OBSERVACION", "<span align='justify'>" + f + "</b></span>", true, true);

                                                  }
                                              }
                                          }],
                                      },

                ]


            });

            document.getElementById("tablaOT").style.display = "block";
            document.getElementById("datosOT").style.display = "block";
        }

    } catch (e) {
        return;
        //mens("Error de conexi?n a la base", "mens"); return;
    }
}



function showDetails(e) {

    var grid = $("#datosOT").data("kendoGrid");
    var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
    e.preventDefault();

    var UrlDetalleOTEnvia = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Detalle/" + dataItem.codigo_empresa + "," + dataItem.anio_ga35 + "," + dataItem.secuencia_orden;

    localStorage.setItem("ls_urldetot", UrlDetalleOTEnvia);

    kendo.mobile.application.navigate("components/detalle_ot/view.html");
}


/*--------------------------------------------------------------------
Fecha: 18/08/2017
Detalle: Captura la imagen y la sube a un repositorio
Autor: RRP
--------------------------------------------------------------------*/
function getImage() {

    resetControls("");

    //document.getElementById("smallImage").style.display = 'none';
    //document.getElementById("smallImage").style.visibility = 'hidden';

    //document.getElementById("smallImage").style.visibility = 'visible';
    document.getElementById("result").innerHTML = "";
    // document.getElementById("vehiculo").innerHTML = "";
    // document.getElementById("vehiculo").style.visibility = 'hidden';

    //  smallImage.style.display = 'none';

    navigator.camera.getPicture(uploadPhoto, function (message) {


        // loading
        document.getElementById("divLoading").innerHTML = "";
        // Borrar imagen de placa
        document.getElementById("smallImage").style.display = "none";

        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No ha seleccionado una imagen. Int\u00E9ntelo nuevamente.");
        //   alert('ALERTA: No ha seleccionado una imagen. Int\u00E9ntelo nuevamente.');
    }, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });
}


/*--------------------------------------------------------------------
Fecha: 29/08/2017
Detalle: Guarda el archivo seleccionado (imagen en este caso) en un repositorio (ASMX)
Autor: RRP
--------------------------------------------------------------------*/
function uploadPhoto(imageURI) {

    //  document.getElementById("vehiculo").style.visibility = 'visible';

    // Presenta la imagen seleccionada
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.style.visibility = 'visible';
    smallImage.src = imageURI;

    // Loading
    document.getElementById("divLoading").innerHTML = "<i class='fa fa-cog fa-spin fa-3x fa-fw'></i>";

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1).replace('.jpg', '');

    // variable global
    resp = imageURI.substr(imageURI.lastIndexOf('/') + 1).replace('.jpg', '');

    options.mimeType = "image/jpeg";
    console.log(options.fileName);
    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";
    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    // alert(imageURI);
    ft.upload(imageURI, "http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/SaveImage", win, fail, options);
}


function win(r) {
    MIshowHint(resp);
}

function fail(error) {
    // loading
    document.getElementById("divLoading").innerHTML = "";
    // Borrar imagen de placa
    document.getElementById("smallImage").style.display = "none";

    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La imagen no se ha guardado correctamente. Int\u00E9ntelo nuevamente.");
}


/*--------------------------------------------------------------------
Fecha: 15/08/2017
Detalle: Extrae el texto de la placa de una imagen seleccionada
Autor: RRP
--------------------------------------------------------------------*/
function MIshowHint(str) {

  //  alert('1');

    str = str.replace("%", "_");
    str = str + ".jpg";

    var data = new FormData();
    if (str.length > 0) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("result").innerHTML = this.responseText;

                var answ = document.getElementById("txtResPlaca").value;

                document.getElementById("result").innerHTML = "";

                if (answ == "ERROR") {
                    // loading
                    document.getElementById("divLoading").innerHTML = "";
                    // Borrar imagen de placa
                    document.getElementById("smallImage").style.display = "none";

                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");

                } else {
                    TraerInformacion(answ, "P");
                }
            }
        };

        xmlhttp.open("GET", "http://ecuainfo78-002-site6.btempurl.com/index.aspx?q=" + str, true);
        xmlhttp.send();
    } else {
        document.getElementById("divLoading").innerHTML = "";
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La imagen no se ha procesado correctamente. Int\u00E9ntelo nuevamente.");
    }
}


function resetControls(visControl) {

  //  var myStringArray = ["smallImage", "result", "vehiculo", "tabstrip"];

    var myStringArray = ["result", "vehiculo", "tabstrip"];
    var arrayLength = myStringArray.length;
    for (var i = 0; i < arrayLength; i++) {
        document.getElementById(myStringArray[i]).style.visibility = 'hidden';
    }

    if (visControl != "") {
        document.getElementById(imgAuto).style.visibility = 'visible';
    }



    document.getElementById("smallImage").style.display = "none";

    nuevoForm();



  //  document.getElementById('infoPlacasVIN').value = "";


}




function vaciaCampos() {

    document.getElementById("tabstrip").style.visibility = 'hidden';
    document.getElementById("smallImage").style.display = "none";

    nuevoForm();

    document.getElementById("infoPlacasVIN").value = "";
}

function nuevoForm() {

    var tabstrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
    tabstrip.select(0);

    //// ot , placa, vin
    //if (vista == "1") {
    // document.getElementById("infoPlacasVIN").value = "";
    //}

    // OT
    document.getElementById("numOT").value = "";

    document.getElementById("divInfOT").style.display = "none";
    document.getElementById("divInfOT").style.visibility = "hidden";


    // datos vehiculo
    document.getElementById("placa").value = "";
    document.getElementById("chasis").value = "";
    document.getElementById("codigo_marca").value = "";
    document.getElementById("mi_modelo").value = "";
    document.getElementById("anio_modelo").value = "";
    document.getElementById("nombre_color").value = "";

    //document.getElementById("seccion").value = "";

    //document.getElementById("tipo").value = "";
    //document.getElementById("mant").value = "";

    // Cbo. Seccion
    cboSecciones("MECANICA");

    // Tipo trabajo
    cboTrabajos(document.getElementById("seccion2").value);

    // Mantenimiento
    cboMantenimientos(document.getElementById("trabajo2").value, " ");

    document.getElementById("km").value = "";
    document.getElementById("nombre_propietario").value = "";
    document.getElementById("chofer").value = "";
    document.getElementById("reparaciones").value = "";
    document.getElementById("observaciones").value = "";
    document.getElementById("pais").value = "";

  //  cboPaises();

    document.getElementById("ciudad_propietario").value = "";
    document.getElementById("calle_principal_propietario").value = "";
    document.getElementById("numero_calle_propietario").value = "";
    document.getElementById("calle_interseccion_propieta").value = "";
    document.getElementById("telefono_propietario").value = "";
    document.getElementById("tipo_dir_propietario").value = "";
    // datos usuario
    document.getElementById("numero_id_propietario").value = "";
    document.getElementById("persona_numero").value = "";
    document.getElementById("persona_nombre").value = "";
    document.getElementById("persona_nombre2").value = "";
    document.getElementById("persona_nombre").value = "";
    document.getElementById("persona_nombre2").value = "";
    document.getElementById("persona_apellido").value = "";
    document.getElementById("persona_apellido2").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("telefono_celular").value = "";

    //   document.getElementById("cli_pais").value = "";

    // Pais
    cboPaises("ECUADOR");

    // Ciudad
    cboCiudades(document.getElementById("pais2").value);


  //  document.getElementById("cli_ciudad_propietario").value = "";
    document.getElementById("cli_calle_principal_propietario").value = "";
    document.getElementById("cli_numero_calle_propietario").value = "";
    document.getElementById("cli_calle_interseccion_propieta").value = "";
    document.getElementById("cli_telefono_propietario").value = "";


    //// Cbo. Tipo persona
    //var arrTipPers = ["NATURAL", "JURIDICA"];
    //cargaCbo("tpers", arrTipPers, "NATURAL");

    //// Cbo. Tipod de documento
    //var arDoc = ["CEDULA", "RUC", "PASAPORTE"];
    //cargaCbo("tid", arDoc, "CEDULA");

    ////// Cbo. tipo direccion
    //var arrDir = ["DOMICILIO", "TRABAJO"];
    //cargaCbo("direc", arrDir, "DOMICILIO");

    // Cbo. forma de pago
    //var arrPago = ["NINGUNA", "EFECTIVO", "CHEQUE", "TARJETA", "CREDITO"];
    //cargaCbo("fpago", arrPago, "NINGUNA");


    // Cbo. forma de pago
  //  cboPagos("NINGUNA");

    var arrPago = ["NINGUNA", "EFECTIVO", "CHEQUE", "TARJETA", "CREDITO"];
    var arrTipPers = ["NATURAL", "JURIDICA"];
    var arDoc = ["CEDULA", "RUC", "PASAPORTE"];
    var arrDir = ["DOMICILIO", "TRABAJO"];


    cboCarga("fpago", arrPago, "NINGUNA", "divcboPago");
    cboCarga("tpers", arrTipPers, "NATURAL", "divcbotpers");
    cboCarga("tid", arDoc, "CEDULA", "divcbotid");
    cboCarga("direc", arrDir, "DOMICILIO", "divcbodirec");



}

function imprimeInfo() {
    var htmlReporte = 'http://ecuainfo78-002-site3.btempurl.com/imagenes/OT20170003556.pdf';

  //  alert("hola");

  //  window.plugins.printer.print('http://blackberry.de', 'BB10');

    window.plugin.printer.print(
                    htmlReporte,
                    // options
                    {
                        graystyle: true
                    },
                    function (msg) {
                        //   console.log('ok: ' + msg)
                        window.myalert("<center><i class=\"fa fa-exclamation-print\"></i> IMPRESION</center>", "El documento se imprimi&oacute; correctamente.");
                    },
                    function (msg) {
                        //alert('error: ' + msg)
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante la impresi&oacute;n.");
                    }
                );
}



/*--------------------------------------------------------------------
Fecha: 05/10/2017
Detalle: Guarda y modifica OT
Autor: RRP
--------------------------------------------------------------------*/
function registrarOT() {
    try {

        var validaOT = "1";

        //  http://localhost:4044/Services/tl/Taller.svc/tl06OrdenesSet

        var UrlGuardaOrden = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesSet";

        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlGuardaOrden);

        //   var Url = urlService + "ClienteSet";


        var anio = document.getElementById("anio_modelo").value;

        if (document.getElementById("numOT").value != "") {
            anio = document.getElementById("anio2").value;
        }


        var anio_cotizacion = document.getElementById("anio_cotizacion").value;
        var anio_modelo = document.getElementById("anio_modelo").value;
        var area_fiscal = document.getElementById("area_fiscal").value;
        var calle_cliente = document.getElementById("calle_principal_propietario").value;
        var calle_interseccion = document.getElementById("calle_interseccion_propieta").value;
        var celular_cliente = document.getElementById("telefono_celular").value;
        var chasis = document.getElementById("chasis").value;


        //   var ciudad_cliente = document.getElementById("ciudad_propietario").value;
        var ciudad_cliente = document.getElementById("ciudad2").value;

        var codigo_empresa = localStorage.getItem("ls_idempresa").toLocaleString();
        var codigo_marca = document.getElementById("codigo_marca").value;

        //     var codigo_modelo = document.getElementById("mi_modelo").value;
        var codigo_modelo = document.getElementById("codigo_modelo2").value;


        var codigo_sucursal = document.getElementById("codigo_sucursal").value;
        //    alert(codigo_sucursal);

        var codigo_taller = document.getElementById("codigo_taller").value;
        //  alert(codigo_taller);


        var color_vehiculo = document.getElementById("nombre_color").value;

        var direccion_cliente = document.getElementById("direc").value;
        var email_cliente = document.getElementById("mail").value;
        var enviado_distribuidor = document.getElementById("enviado_distribuidor").value;
        var estado = document.getElementById("estado").value;
        var fecha_anulacion = document.getElementById("fecha_anulacion").value;
        var fecha_cancelacion = document.getElementById("fecha_cancelacion").value;
        var fecha_creacion = document.getElementById("fecha_creacion").value;
        var fecha_facturacion = document.getElementById("fecha_facturacion").value;
        var fecha_informe_tecnico = document.getElementById("fecha_informe_tecnico").value;
        var fecha_inicio = document.getElementById("fecha_inicio").value;
        var fecha_liquidacion = document.getElementById("fecha_liquidacion").value;
        var fecha_modificacion = document.getElementById("fecha_modificacion").value;
        var fecha_ofrece = document.getElementById("fecha_ofrece").value;
        var fecha_real_entrega = document.getElementById("fecha_real_entrega").value;
        var fecha_recepcion = document.getElementById("fecha_recepcion").value;
        var fecha_retiene_envio = document.getElementById("fecha_retiene_envio").value;

        var hora_anulacion = document.getElementById("hora_anulacion").value;
        var hora_cancelacion = document.getElementById("hora_cancelacion").value;
        var hora_creacion = document.getElementById("hora_creacion").value;
        var hora_facturacion = document.getElementById("hora_facturacion").value;
        var hora_informe_tecnico = document.getElementById("hora_informe_tecnico").value;
        var hora_inicio = document.getElementById("hora_inicio").value;
        var hora_liquidacion = document.getElementById("hora_liquidacion").value;
        var hora_modificacion = document.getElementById("hora_modificacion").value;
        var hora_ofrece = document.getElementById("hora_ofrece").value;
        var hora_real_entrega = document.getElementById("hora_real_entrega").value;
        var hora_recepcion = document.getElementById("hora_recepcion").value;
        var hora_retiene_envio = document.getElementById("hora_retiene_envio").value;


        var identifica_cliente = document.getElementById("numero_id_propietario").value;
        if (identifica_cliente == "")
        {
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese el N&uacute;mero de Documento del Cliente");
            return;
        }


        // TIPO TRABAJO
        var tipo_trabajo = document.getElementById("trabajo2").value;

        // TIPO MANTENIMIENTO
        var tipo_mantenimiento = document.getElementById("mantenimiento2").value;
        var arrManten = "";

        if (tipo_trabajo == "MANTENIMIENTO" || tipo_trabajo == "MP") {

            if (tipo_mantenimiento == " " || tipo_mantenimiento == "") {
                validaOT = "0";
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Seleccione el Tipo de Mantenimiento");
                return;
            }
            else {
                arrManten = document.getElementById("mantenimiento2").value.split("(");
                tipo_mantenimiento = arrManten[1].replace(")", "");
            }
        }

        // KM
        var kilometraje = document.getElementById("km").value;

        if (kilometraje == "" || kilometraje == "0") {
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese el Kilometraje");
            return;
        }
        else {
            var patron = /^\d*$/;
            if (patron.test(kilometraje)) {
                validaOT = "1";
            } else {
                validaOT = "0";
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "El Kilometraje debe ser un n&uacute;mero entero mayor a 0");
                return;
            }
        }

        var nivel_gasolina = document.getElementById("nivel_gasolina").value;
        var nombre_autoriza_trabajo = document.getElementById("autorizadoPor").value;

        //    var nombre_cliente =   document.getElementById("nombre_cliente").value;

        var nombre_cliente = "";

        if (document.getElementById("persona_apellido").value != "" && document.getElementById("persona_nombre").value != "") {
            nombre_cliente = document.getElementById("persona_apellido").value + "," + document.getElementById("persona_apellido2").value + "," + document.getElementById("persona_nombre").value + "," + document.getElementById("persona_nombre2").value;
        }
        else {
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese los Nombres y Apellidos del Cliente");
            return;
        }


        // CHOFER
        var nombre_entrega_auto = document.getElementById("chofer").value;

        if (nombre_entrega_auto == "") {
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese el nombre del Chofer");
            return;
        }

        var nombre_propietario = document.getElementById("nombre_propietario").value;

        var numero_calle = document.getElementById("numero_calle_propietario").value;
        var numero_cono = document.getElementById("numero_cono").value;
        var numero_cotizacion = document.getElementById("numero_cotizacion").value;
        var numero_motor = document.getElementById("numero_motor").value;
        var numero_orden = document.getElementById("numero_orden").value;
        var numero_poliza = document.getElementById("numero_poliza").value;
        var numero_siniestro = document.getElementById("numero_siniestro").value;
        var observacion = document.getElementById("observaciones").value;

        var observacion_cancelacion = document.getElementById("observacion_cancelacion").value;
        var observacion_tecnica = document.getElementById("observacion_tecnica").value;


        //   var pais_cliente = document.getElementById("pais").value;
        var pais_cliente = document.getElementById("pais2").value;

        var persona_clase = document.getElementById("persona_clase").value;
        var persona_nombre_mecanico = document.getElementById("persona_nombre_mecanico").value;

        var persona_numero = document.getElementById("persona_numero").value;

        var persona_numero_aseguradora = document.getElementById("persona_numero_aseguradora").value;
        var persona_numero_control = document.getElementById("persona_numero_control").value;
        var persona_numero_garantia = document.getElementById("persona_numero_garantia").value;
        var persona_numero_mecanico = document.getElementById("persona_numero_mecanico").value;
        var persona_numero_recepta = document.getElementById("persona_numero_recepta").value;
        var persona_tipo = document.getElementById("tpers").value;
        var placa = document.getElementById("placa").value;
        var prog_cancelacion = document.getElementById("prog_cancelacion").value;
        var prog_creacion = document.getElementById("prog_creacion").value;
        var prog_modificacion = document.getElementById("prog_modificacion").value;
        var referencia_srg = document.getElementById("referencia_srg").value;

        var reparaciones_solicitadas = document.getElementById("reparaciones").value;
        var retener_envio = document.getElementById("retener_envio").value;

        //     var seccion_orden_trabajo = document.getElementById("seccion").value;
        var seccion_orden_trabajo = document.getElementById("seccion2").value;

        var secuencia_control = document.getElementById("secuencia_control").value;
        var secuencia_cotizacion = document.getElementById("secuencia_cotizacion").value;
        var secuencia_fisica_aut = document.getElementById("secuencia_fisica_aut").value;
        var secuencia_orden = document.getElementById("secuencia_orden").value;
     
        var secuencia_recepta = document.getElementById("secuencia_recepta").value;
        var telefono_cliente = document.getElementById("cli_telefono_propietario").value;
        var tiene_terceros = document.getElementById("tiene_terceros").value;
        var tipo_id_cliente = document.getElementById("tid").value;

        var tipo_registro_aseguradora = document.getElementById("tipo_registro_aseguradora").value;

        var usuario_anulacion = document.getElementById("usuario_anulacion").value;
        var usuario_cancelacion = document.getElementById("usuario_cancelacion").value;
        var usuario_creacion = document.getElementById("usuario_creacion").value;
        var usuario_informe_tecnico = document.getElementById("usuario_informe_tecnico").value;
        var usuario_modificacion = document.getElementById("usuario_modificacion").value;
        var usuario_retiene_envio = document.getElementById("usuario_retiene_envio").value;
        var valor_autoriza_aseguradora = document.getElementById("valor_autoriza_aseguradora").value;
        var valor_autoriza_cliente = document.getElementById("valor_autoriza_cliente").value;
        var color_cono = document.getElementById("color_cono").value;
        var viene_de_cita = document.getElementById("viene_de_cita").value;
        var requiere_taxi = document.getElementById("requiere_taxi").value;
        var eleva_vehiculo = document.getElementById("eleva_vehiculo").value;
        var persona_numero_comercial = document.getElementById("persona_numero_comercial").value;
        var persona_nombre_comercial = document.getElementById("persona_nombre_comercial").value;
        var sobreturno = document.getElementById("sobreturno").value;
        var cerro_costo_tintes = document.getElementById("cerro_costo_tintes").value;
        var cita_retorno = document.getElementById("cita_retorno").value;
        var presupuesto_previo = document.getElementById("presupuesto_previo").value;
        var ot_revisada = document.getElementById("ot_revisada").value;
        var explica_cliente = document.getElementById("explica_cliente").value;
        var transmitido_af = document.getElementById("transmitido_af").value;
        var fecha_cita = document.getElementById("fecha_cita").value;
        var hora_cita = document.getElementById("hora_cita").value;
        var clave_af = document.getElementById("clave_af").value;
        var agencia_af = document.getElementById("agencia_af").value;
        var asesor_af = document.getElementById("asesor_af").value;

        // Forma de pago
        var forma_pago_esperada = document.getElementById("fpago").value;

        if (forma_pago_esperada == "NINGUNA") {
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Seleccione la forma de Pago");
            return;
        }
        else {
            if (forma_pago_esperada == "TARJETA" && cual_tarjeta_credito == "") {
                validaOT = "0";
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese la Tarjeta");
                return;
            }
        }

        // Numero de tarjeta
        var cual_tarjeta_credito = document.getElementById("num_tarjeta").value;


        //     alert(document.getElementById("num_tarjeta").value);



        var params = {
           //  "anio": anio,
            "anio_cotizacion": anio_cotizacion,
            "anio_modelo": anio_modelo,
            "area_fiscal": area_fiscal,
            "calle_cliente": calle_cliente,
            "calle_interseccion": calle_interseccion,
            "celular_cliente": celular_cliente,
            "chasis": chasis,
            "ciudad_cliente": ciudad_cliente,
            "codigo_empresa": codigo_empresa,
            "codigo_marca": codigo_marca,
            "codigo_modelo": codigo_modelo,
            "codigo_sucursal": codigo_sucursal,
            "codigo_taller": codigo_taller,
            "color_vehiculo": color_vehiculo,
            "cual_tarjeta_credito": cual_tarjeta_credito,
            "direccion_cliente": direccion_cliente,
            "email_cliente": email_cliente,
            "enviado_distribuidor": enviado_distribuidor,
            "estado": estado,
            "fecha_anulacion": fecha_anulacion,
            "fecha_cancelacion": fecha_cancelacion,
            "fecha_creacion": fecha_creacion,
            "fecha_facturacion": fecha_facturacion,
            "fecha_informe_tecnico": fecha_informe_tecnico,
            "fecha_inicio": fecha_inicio,
            "fecha_liquidacion": fecha_liquidacion,
            "fecha_modificacion": fecha_modificacion,
            "fecha_ofrece": fecha_ofrece,
            "fecha_real_entrega": fecha_real_entrega,
            "fecha_recepcion": fecha_recepcion,
            "fecha_retiene_envio": fecha_retiene_envio,
            "forma_pago_esperada": forma_pago_esperada,
            "hora_anulacion": hora_anulacion,
            "hora_cancelacion": hora_cancelacion,
            "hora_creacion": hora_creacion,
            "hora_facturacion": hora_facturacion,
            "hora_informe_tecnico": hora_informe_tecnico,
            "hora_inicio": hora_inicio,
            "hora_liquidacion": hora_liquidacion,
            "hora_modificacion": hora_modificacion,
            "hora_ofrece": hora_ofrece,
            "hora_real_entrega": hora_real_entrega,
            "hora_recepcion": hora_recepcion,
            "hora_retiene_envio": hora_retiene_envio,
            "identifica_cliente": identifica_cliente,
            "kilometraje": kilometraje,
            "nivel_gasolina": nivel_gasolina,
            "nombre_autoriza_trabajo": nombre_autoriza_trabajo,
            "nombre_cliente": nombre_cliente,
            "nombre_entrega_auto": nombre_entrega_auto,
            "nombre_propietario": nombre_propietario,
            "numero_calle": numero_calle,
            "numero_cono": numero_cono,
            "numero_cotizacion": numero_cotizacion,
            "numero_motor": numero_motor,
            "numero_orden": numero_orden,
            "numero_poliza": numero_poliza,
            "numero_siniestro": numero_siniestro,
            "observacion": observacion,
            "observacion_cancelacion": observacion_cancelacion,
            "observacion_tecnica": observacion_tecnica,
            "pais_cliente": pais_cliente,
            "persona_clase": persona_clase,
            "persona_nombre_mecanico": persona_nombre_mecanico,
            "persona_numero": persona_numero,
            "persona_numero_aseguradora": persona_numero_aseguradora,
            "persona_numero_control": persona_numero_control,
            "persona_numero_garantia": persona_numero_garantia,
            "persona_numero_mecanico": persona_numero_mecanico,
            "persona_numero_recepta": persona_numero_recepta,
            "persona_tipo": persona_tipo,
            "placa": placa,
            "prog_cancelacion": prog_cancelacion,
            "prog_creacion": prog_creacion,
            "prog_modificacion": prog_modificacion,
            "referencia_srg": referencia_srg,
            "reparaciones_solicitadas": reparaciones_solicitadas,
            "retener_envio": retener_envio,
            "seccion_orden_trabajo": seccion_orden_trabajo,
            "secuencia_control": secuencia_control,
            "secuencia_cotizacion": secuencia_cotizacion,
            "secuencia_fisica_aut": secuencia_fisica_aut,
            "secuencia_orden": secuencia_orden,
            "secuencia_recepta": secuencia_recepta,
            "telefono_cliente": telefono_cliente,
            "tiene_terceros": tiene_terceros,
            "tipo_id_cliente": tipo_id_cliente,
            "tipo_mantenimiento": tipo_mantenimiento,
            "tipo_registro_aseguradora": tipo_registro_aseguradora,
            "tipo_trabajo": tipo_trabajo,
            "usuario_anulacion": usuario_anulacion,
            "usuario_cancelacion": usuario_cancelacion,
            "usuario_creacion": usuario_creacion,
            "usuario_informe_tecnico": usuario_informe_tecnico,
            "usuario_modificacion": usuario_modificacion,
            "usuario_retiene_envio": usuario_retiene_envio,
            "valor_autoriza_aseguradora": valor_autoriza_aseguradora,
            "valor_autoriza_cliente": valor_autoriza_cliente,
            "color_cono": color_cono,
            "viene_de_cita": viene_de_cita,
            "requiere_taxi": requiere_taxi,
            "eleva_vehiculo": eleva_vehiculo,
            "persona_numero_comercial": persona_numero_comercial,
            "persona_nombre_comercial": persona_nombre_comercial,
            "sobreturno": sobreturno,
            "cerro_costo_tintes": cerro_costo_tintes,
            "cita_retorno": cita_retorno,
            "presupuesto_previo": presupuesto_previo,
            "ot_revisada": ot_revisada,
            "explica_cliente": explica_cliente,
            "transmitido_af": transmitido_af,
            "fecha_cita": fecha_cita,
            "hora_cita": hora_cita,
            "clave_af": clave_af,
            "agencia_af": agencia_af,
            "asesor_af": asesor_af,
        };


        if (document.getElementById("numOT").value != "") {
            var params = {
                  "anio": anio,
                "anio_cotizacion": anio_cotizacion,
                "anio_modelo": anio_modelo,
                "area_fiscal": area_fiscal,
                "calle_cliente": calle_cliente,
                "calle_interseccion": calle_interseccion,
                "celular_cliente": celular_cliente,
                "chasis": chasis,
                "ciudad_cliente": ciudad_cliente,
                "codigo_empresa": codigo_empresa,
                "codigo_marca": codigo_marca,
                "codigo_modelo": codigo_modelo,
                "codigo_sucursal": codigo_sucursal,
                "codigo_taller": codigo_taller,
                "color_vehiculo": color_vehiculo,
                "cual_tarjeta_credito": cual_tarjeta_credito,
                "direccion_cliente": direccion_cliente,
                "email_cliente": email_cliente,
                "enviado_distribuidor": enviado_distribuidor,
                "estado": estado,
                "fecha_anulacion": fecha_anulacion,
                "fecha_cancelacion": fecha_cancelacion,
                "fecha_creacion": fecha_creacion,
                "fecha_facturacion": fecha_facturacion,
                "fecha_informe_tecnico": fecha_informe_tecnico,
                "fecha_inicio": fecha_inicio,
                "fecha_liquidacion": fecha_liquidacion,
                "fecha_modificacion": fecha_modificacion,
                "fecha_ofrece": fecha_ofrece,
                "fecha_real_entrega": fecha_real_entrega,
                "fecha_recepcion": fecha_recepcion,
                "fecha_retiene_envio": fecha_retiene_envio,
                "forma_pago_esperada": forma_pago_esperada,
                "hora_anulacion": hora_anulacion,
                "hora_cancelacion": hora_cancelacion,
                "hora_creacion": hora_creacion,
                "hora_facturacion": hora_facturacion,
                "hora_informe_tecnico": hora_informe_tecnico,
                "hora_inicio": hora_inicio,
                "hora_liquidacion": hora_liquidacion,
                "hora_modificacion": hora_modificacion,
                "hora_ofrece": hora_ofrece,
                "hora_real_entrega": hora_real_entrega,
                "hora_recepcion": hora_recepcion,
                "hora_retiene_envio": hora_retiene_envio,
                "identifica_cliente": identifica_cliente,
                "kilometraje": kilometraje,
                "nivel_gasolina": nivel_gasolina,
                "nombre_autoriza_trabajo": nombre_autoriza_trabajo,
                "nombre_cliente": nombre_cliente,
                "nombre_entrega_auto": nombre_entrega_auto,
                "nombre_propietario": nombre_propietario,
                "numero_calle": numero_calle,
                "numero_cono": numero_cono,
                "numero_cotizacion": numero_cotizacion,
                "numero_motor": numero_motor,
                "numero_orden": numero_orden,
                "numero_poliza": numero_poliza,
                "numero_siniestro": numero_siniestro,
                "observacion": observacion,
                "observacion_cancelacion": observacion_cancelacion,
                "observacion_tecnica": observacion_tecnica,
                "pais_cliente": pais_cliente,
                "persona_clase": persona_clase,
                "persona_nombre_mecanico": persona_nombre_mecanico,
                "persona_numero": persona_numero,
                "persona_numero_aseguradora": persona_numero_aseguradora,
                "persona_numero_control": persona_numero_control,
                "persona_numero_garantia": persona_numero_garantia,
                "persona_numero_mecanico": persona_numero_mecanico,
                "persona_numero_recepta": persona_numero_recepta,
                "persona_tipo": persona_tipo,
                "placa": placa,
                "prog_cancelacion": prog_cancelacion,
                "prog_creacion": prog_creacion,
                "prog_modificacion": prog_modificacion,
                "referencia_srg": referencia_srg,
                "reparaciones_solicitadas": reparaciones_solicitadas,
                "retener_envio": retener_envio,
                "seccion_orden_trabajo": seccion_orden_trabajo,
                "secuencia_control": secuencia_control,
                "secuencia_cotizacion": secuencia_cotizacion,
                "secuencia_fisica_aut": secuencia_fisica_aut,
                "secuencia_orden": secuencia_orden,
                "secuencia_recepta": secuencia_recepta,
                "telefono_cliente": telefono_cliente,
                "tiene_terceros": tiene_terceros,
                "tipo_id_cliente": tipo_id_cliente,
                "tipo_mantenimiento": tipo_mantenimiento,
                "tipo_registro_aseguradora": tipo_registro_aseguradora,
                "tipo_trabajo": tipo_trabajo,
                "usuario_anulacion": usuario_anulacion,
                "usuario_cancelacion": usuario_cancelacion,
                "usuario_creacion": usuario_creacion,
                "usuario_informe_tecnico": usuario_informe_tecnico,
                "usuario_modificacion": usuario_modificacion,
                "usuario_retiene_envio": usuario_retiene_envio,
                "valor_autoriza_aseguradora": valor_autoriza_aseguradora,
                "valor_autoriza_cliente": valor_autoriza_cliente,
                "color_cono": color_cono,
                "viene_de_cita": viene_de_cita,
                "requiere_taxi": requiere_taxi,
                "eleva_vehiculo": eleva_vehiculo,
                "persona_numero_comercial": persona_numero_comercial,
                "persona_nombre_comercial": persona_nombre_comercial,
                "sobreturno": sobreturno,
                "cerro_costo_tintes": cerro_costo_tintes,
                "cita_retorno": cita_retorno,
                "presupuesto_previo": presupuesto_previo,
                "ot_revisada": ot_revisada,
                "explica_cliente": explica_cliente,
                "transmitido_af": transmitido_af,
                "fecha_cita": fecha_cita,
                "hora_cita": hora_cita,
                "clave_af": clave_af,
                "agencia_af": agencia_af,
                "asesor_af": asesor_af,
            };

        }



        //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(params));


        if (validaOT == "1") {

            $.ajax({
                url: UrlGuardaOrden,
                type: "POST",
                data: JSON.stringify(params),
                async: false,
                dataType: "json",
                //Content-Type: application/json
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (data) {

                 //   alert(data);

                    if (data.includes("Success") == true) {
                        try {

                            var arrRespOT = data.split(",");

                            // 1,Success,201703049/01_01_201703049.pdf
                            if (document.getElementById("numOT").value != "") {
                                window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> MODIFICADO</center>", "La Orden de Trabajo <b>" + arrRespOT[2] + "</b></br>fue modificada correctamente");
                            }
                            else {
                                window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> REGISTRADO</center>", "La Orden de Trabajo <b>" + arrRespOT[2] + "</b></br>fue almacenada correctamente");
                            }

                            document.getElementById("numOT").value = arrRespOT[2];

                            document.getElementById("divInfOT").style.display = "block";
                            document.getElementById("divInfOT").style.visibility = "visible";

                            // busca por OT
                            TraerInformacion(document.getElementById("numOT").value, 'O');


                            return;
                        } catch (s) {

                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error en el servicio de Ordenes de Trabajo");

                            return;
                        } //alert (s); 
                    }
                    else {

                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No fue ingresado el registro. <br />" + data);

                        //if (data.substring(0, 1) == "0" || data.substring(0, 1) == "1") { data = data.substring(2, data.length); }
                        //mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                        //"Advertencia", "<span align='justify'>" + data + "</b></span>", true, true); return;
                    }
                },
                error: function (err) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso.<br /> Int\u00E9ntelo nuevamente.");

                    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                }
            });
        }

    } catch (e) {
        // mens("Error en el servicio clientes", "mens");
        return;
    } //aler(e);
}

/*--------------------------------------------------------------------
Fecha: 06/10/2017
Detalle: Solo permite ingresar numeros
Autor: RRP
--------------------------------------------------------------------*/
//function soloNumeros(e) {

//    var key = window.Event ? e.which : e.keyCode

//    if (key >= 48 && key <= 57) {
//        return (key >= 48 && key <= 57)
//    }
//    else {

//        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "El Kilometraje solo admite n&uacute;meros enteros.");
//        return;
//    }
//}

//function verOT(strVIN, datFecIni, datFecFin) {


//    var UrlOrdenTrab = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Ordenes/1,2," + strVIN + "," + datFecIni + "," + datFecFin;

//    var infor;
//    $.ajax({
//        url: UrlOrdenTrab,
//        type: "GET",
//        async: false,
//        dataType: "json",
//        success: function (data) {
//            try {
//                infor = (JSON.parse(data.OrdenesGetResult)).CabeceraOT01;
//            } catch (e) {
//              //  mens("No existe datos para esta consulta", "mens"); return;
//            }
//        },
//        error: function (err) {
//          //  mens("Error en consulta OT", "mens"); return;
//        }
//    });
//    var dataSource = new kendo.data.DataSource({ data: infor });
//    var grid = $("#listView22").data("kendoGrid");
//    grid.setDataSource(dataSource);

//}



/*--------------------------------------------------------------------
Fecha: 04/08/2017
Detalle: Sube la imagen selecionada a un repositorio (PHP)
Autor: RRP
--------------------------------------------------------------------*/
//function uploadPhoto(imageURI) {

//    var options = new FileUploadOptions();
//    options.fileKey = "file";
//    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1).replace('.jpg', '');

//    // variable global
//    resp = imageURI.substr(imageURI.lastIndexOf('/') + 1).replace('.jpg', '');

//    options.mimeType = "image/jpeg";
//    console.log(options.fileName);
//    var params = new Object();
//    params.value1 = "test";
//    params.value2 = "param";
//    options.params = params;
//    options.chunkedMode = false;

//    var ft = new FileTransfer();

//    ft.upload(imageURI, "http://ecuainfo78-002-site4.btempurl.com/upload.php",
//        win,
//        function (error) { document.getElementById("result").innerHTML = "Ha ocurrido un error. Int\u00E9ntelo nuevamente."; }, options);

//    var smallImage = document.getElementById('smallImage');
//    smallImage.style.display = 'block';
//    // Show the captured photo.
//    smallImage.src = imageURI;
//}

//function win(r) {
//    MIshowHint(resp);
//}

//function fail(error) {
//    alert("An error has occurred: Code = " + error.value);
//}



//function TraerInformacion2(responseText, tipo) {

//    //document.getElementById("vehiculo").style.visibility = 'hidden';
//    //document.getElementById("result").style.visibility = 'hidden';



//    var intResult = 0;

//    try {



//        var Url = "";

//        // http://186.71.21.170:8077/taller/Services/TL/Taller.svc/tl06OrdenesGet/1,json;1;;;PCT7242;

//        Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";;;" + responseText;



//        if (tipo == "P") {
//            // Placa
//            Url = wsInfoVehiculo + "/BuscarVH/2,2;;;;;;" + responseText + ";;JSON;";
//        } else {
//            // Chasis
//            Url = wsInfoVehiculo + "/BuscarVH/2,2;;;;;" + responseText + ";;;JSON;";
//        }


//        var infor;
//        $.ajax({
//            url: Url,
//            type: "GET",
//            async: false,
//            dataType: "json",
//            success: function (data) {
//                try {

//                    //   alert(inspeccionar(data));

//                    infor = (JSON.parse(data.BuscarVHResult)).VehiculoModel;


//                    intResult = 1;




//                } catch (e) {

//                    // loading
//                    document.getElementById("divLoading").innerHTML = "";
//                    // Borrar imagen de placa
//                    document.getElementById("smallImage").style.display = "none";


//                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos del \nC\u00F3digo: " + responseText);
//                    return;
//                }
//            },
//            error: function (err) {

//                // loading
//                document.getElementById("divLoading").innerHTML = "";
//                // Borrar imagen de placa
//                document.getElementById("smallImage").style.display = "none";

//                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
//                return;
//            }
//        });


//        //------------------------

//        if (intResult > 0) {

//            //form
//            var dataSource = new kendo.data.DataSource({
//                data: infor,
//                aggregate: [{
//                    field: "chasis",
//                    aggregate: "count"
//                }]
//            });

//            dataSource.fetch(function () {

//                var numReg = dataSource.aggregates().chasis;

//                //  alert(numReg.count);

//                if (numReg.count == 1) {
//                    // Toma la primera fila
//                    var infoVehiculo = dataSource.at(0);

//                    var viewModel = kendo.observable({
//                        placa: infoVehiculo.placa,
//                        chasis: infoVehiculo.chasis,
//                        codigo_marca: infoVehiculo.codigo_marca,
//                        nombre_color: infoVehiculo.nombre_color,
//                        anio_modelo: infoVehiculo.anio_modelo,
//                        color_vehiculo: infoVehiculo.color_vehiculo,
//                        nombre_propietario: infoVehiculo.nombre_propietario,
//                        numero_id_propietario: infoVehiculo.numero_id_propietario,
//                        mi_modelo: infoVehiculo.nombre_modelo + " (" + infoVehiculo.codigo_modelo + ")",

//                        pais: infoVehiculo.pais,
//                        ciudad_propietario: infoVehiculo.ciudad_propietario,
//                        calle_principal_propietario: infoVehiculo.calle_principal_propietario,
//                        numero_calle_propietario: infoVehiculo.numero_calle_propietario,
//                        calle_interseccion_propieta: infoVehiculo.calle_interseccion_propieta,
//                        telefono_propietario: infoVehiculo.telefono_propietario,

//                        tipo_dir_propietario: infoVehiculo.tipo_dir_propietario,

//                        startOver: function () {
//                            this.set("placa", "");
//                            this.set("chasis", "");
//                            this.set("codigo_marca", "");
//                            this.set("nombre_color", "");
//                            this.set("anio_modelo", "");
//                            this.set("color_vehiculo", "");
//                            this.set("nombre_propietario", "");
//                            this.set("pais", "");
//                        }
//                    });

//                    //var arrMant = ["- seleccione -", "ASIAUTO", "KMOTORS"];
//                    //cargaCbo("mant", arrMant, "- seleccione -");

//                    //var arrTipo = ["- seleccione -"];
//                    //cargaCbo("tipo", arrTipo, "- seleccione -");

//                    /* -----------------------
//                    Info Cliente
//                    -------------------------*/
//                    ConsultarCliente(infoVehiculo.numero_id_propietario);


//                    //  ConsultarCliente("1706991294");

//                    /* -----------------------
//                    Info Orden de Trabajo  
//                    -------------------------*/
//                    $("#dpInicio").kendoDatePicker({
//                        format: "dd-MM-yyyy",
//                    });


//                    $("#dpFin").kendoDatePicker({
//                        format: "dd-MM-yyyy",
//                    });


//                    ConsultarEM(infoVehiculo.chasis);

//                    ConsultarOT(infoVehiculo.chasis, document.getElementById("dpInicio").value, document.getElementById("dpFin").value);

//                    // loading
//                    document.getElementById("divLoading").innerHTML = "";
//                    // Borrar imagen de placa
//                    document.getElementById("smallImage").style.display = "none";

//                    document.getElementById("result").style.visibility = 'visible';
//                    document.getElementById("vehiculo").style.visibility = 'visible';
//                    document.getElementById("tabstrip").style.visibility = 'visible';

//                } else {
//                    // loading
//                    document.getElementById("divLoading").innerHTML = "";
//                    // Borrar imagen de placa
//                    document.getElementById("smallImage").style.display = "none";

//                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
//                }
//                kendo.bind($("#datosVEH"), viewModel);
//            });
//            //end form
//        }

//        //------------------------

//        //  return infor[0].path_prefactura;
//    } catch (e1) {
//        alert(e1);
//    }
//}



// END_CUSTOM_CODE_lector_barras