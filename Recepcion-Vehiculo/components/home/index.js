'use strict';

app.home = kendo.observable({
    onShow: function () {
        homeInfo()
    },
    afterShow: function() {}
});
app.localization.registerView('home');
//comentario a ver si funciona
// START_CUSTOM_CODE_home RRP
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Carga el cbo de agencias por empresa y usu.
Parametros:
--------------------------------------------------------------------*/
function homeInfo() {

    // Nombre de empresa en pagina Incio
    document.getElementById("usuEmpresa2").innerHTML = localStorage.getItem("ls_empresa").toLocaleString();

    // Recupera las Agencias por Empresa y Usuario
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/AU/Seguridad.svc/EmpAgUsuario/" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_usulog").toLocaleString()


  //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);


    var accResp = "";

    $.ajax({
        url: Url,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                accResp = JSON.parse(data.EmpAgUsuarioResult);
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Datos Incorrectos");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Datos Incorrectos");
            return;
        }
    });





    // Crea el combo de Agencias con la data anterior 
    if (accResp.length > 0) {
        var cboAgenciaHTML = "<p><label class='w3-text-red'><b>Sucursal / Agencia</b></label><select id='cboAgenciasUS' class='w3-input w3-border textos select-style'>";

        cboAgenciaHTML += "<option value='0'>seleccione</option>";

        for (var i = 0; i < accResp.length; i++) {
            cboAgenciaHTML += "<option  value='" + accResp[i].CodigoSucursal + "," + accResp[i].CodigoAgencia + "'>" + accResp[i].NombreAgencia + "</option>";
        }
        cboAgenciaHTML += "</select> </p><button class='w3-button w3-block w3-section w3-red w3-ripple w3-padding' onclick='agenciaActiva()'>ASIGNAR</button>";
        document.getElementById("cboAgenciaUsu").innerHTML = cboAgenciaHTML;

        verMenu("0");
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "El usuario no tiene agencias asignadas");
        cerrarSistema();
    }

}

/*--------------------------------------------------------------------
Fecha: 27/09/2017
Descripcion: Presenta el Usuario, Empresa, Agencia
Parametros:
--------------------------------------------------------------------*/
function agenciaActiva() {
    if (document.getElementById("cboAgenciasUS").value != 0) {
        localStorage.setItem("ls_usagencia", document.getElementById("cboAgenciasUS").value);


        var arrSucAgen = document.getElementById("cboAgenciasUS").value.split(",");

        if (arrSucAgen.length > 0) {
            localStorage.setItem("ls_ussucursal", arrSucAgen[0]);
            localStorage.setItem("ls_usagencia", arrSucAgen[1]);
        }

        localStorage.setItem("ls_usagencianom", document.getElementById("cboAgenciasUS").options[document.getElementById("cboAgenciasUS").selectedIndex].innerHTML);

        var infoUsuEmpAg =
           "<font color='black' style='font-size: 10px'>USUARIO:&nbsp; " + localStorage.getItem("ls_usunom").toLocaleString() + '</font> <br />' +
            "<font color='black' style='font-size: 10px'>EMPRESA:&nbsp; " + localStorage.getItem("ls_empresa").toLocaleString() + '</font> <br />' +
          "<font color='black' style='font-size: 10px'>AGENCIA:&nbsp; " + localStorage.getItem("ls_usagencianom").toLocaleString() + "</font>";

    //    window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> ASIGNADO</center>", infoUsuEmpAg);

        // Nombre del usuario en el Menu Principal
        var infoUsuHtml = "<font color='white'><i class='fa fa-user-circle' aria-hidden='true'></i>&nbsp;&nbsp;</font>" +
            localStorage.getItem("ls_usunom").toLocaleString() + ' <br />' +
          "<font color='white'>EMPRESA:</font>&nbsp; " + localStorage.getItem("ls_empresa").toLocaleString() + ' <br />' +
          "<font color='white'>AGENCIA:</font>&nbsp; " + localStorage.getItem("ls_usagencianom").toLocaleString();

        document.getElementById("iniUsuario").innerHTML = infoUsuHtml;

        document.getElementById("iniUsuarioMenu").innerHTML = "<table align='center'> <tr><td><h1>" +
        "<font color='red'>USUARIO:</font>&nbsp; " + localStorage.getItem("ls_usunom").toLocaleString() + ' <br />' +
        "<font color='red'>EMPRESA:</font>&nbsp; " + localStorage.getItem("ls_empresa").toLocaleString() + ' <br />' +
        "<font color='red'>AGENCIA:</font>&nbsp; " + localStorage.getItem("ls_usagencianom").toLocaleString() +
         "</h1></td></tr> </table>";

        verMenu("1");
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Seleccione la Agencia");
    }

}


function verMenu(vista) {

    if (vista == "0") {
        document.getElementById("menuCboAgencia").style.display = "block";
        document.getElementById("menuPagInicio").style.display = "none";
    }
    else {
        document.getElementById("menuCboAgencia").style.display = "none";
        document.getElementById("menuPagInicio").style.display = "block";
    }
}

// END_CUSTOM_CODE_home