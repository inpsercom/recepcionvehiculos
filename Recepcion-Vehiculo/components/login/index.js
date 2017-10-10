'use strict';

app.login = kendo.observable({
    onShow: function () {

        localStorage.setItem("ls_verRecepcion", "0");


        kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: true }));
        kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: false}));


    },
    afterShow: function () {
    }
});
app.localization.registerView('login');

// START_CUSTOM_CODE_login
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Acceso por codigo de empresa
Parametros:
    codEmpresa: codigo de la empresa (EJ.100001)
--------------------------------------------------------------------*/
function accesoEmpresa(codEmpresa) {
    try {
        if ((codEmpresa != "") && (codEmpresa)) {

            var empResp = "";
            var Url2 = wsPrincipal + "/biss.sherloc/Services/MV/Moviles.svc/mv00EmpresasGet/1,json;" + codEmpresa + ";";
            
       //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url2);

            $.ajax({
                url: Url2,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {

                        //  alert(inspeccionar(data));
                        empResp = (JSON.parse(data.mv00EmpresasGetResult)).tmpEmpresas[0];

                        if (empResp.estado == "ACTIVO") {
                            localStorage.setItem("ls_empresa", empResp.nombre_empresa);
                            localStorage.setItem("ls_idempresa", empResp.empresa_erp);
                            localStorage.setItem("ls_url1", empResp.URL_mayorista);
                            localStorage.setItem("ls_url2", empResp.URL_concesionario);

                            // alert(inspeccionar(empResp));
                            //    document.getElementById("usuEmpresa").innerHTML = "<b>" + empResp.nombre_empresa + "</b>";

                            document.getElementById("usuEmpresa").innerHTML = localStorage.getItem("ls_empresa").toLocaleString();

                            kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: false }));
                            kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: true }));
                        }
                        else {

                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>Empresa Desactivada");
                        }


                    } catch (e) {

                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>C&oacute;digo Incorrecto");

                        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe de conexi&oacute;n con el servicio.");
                        //borraCamposlogin();
                        return;
                    }
                },
                error: function (err) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>C&oacute;digo Incorrecto");
                    return;
                }
            });
            return empResp;
        }
        else {

            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>Ingrese el C&oacute;digo");
        }

    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>C&oacute;digo Incorrecto");
        return;
    }

}


/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Acceso de Usuario
Parametros:
    accUsu: usuario
    accPass: pass
--------------------------------------------------------------------*/
function accesoUsuario(accUsu, accPass) {
    try {
        if ((accUsu != "") && (accUsu)) {

            var accResp = "";             

            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/AU/Seguridad.svc/accesoUsuario/" + accUsu;

            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        accResp = JSON.parse(data.accesoUsuarioResult);

                     //   localStorage.setItem("usuarioActual", JSON.parse(data.accesoUsuarioResult));
                        localStorage.setItem("ls_usunom", accResp.Observaciones);
                        localStorage.setItem("ls_usulog", accResp.UserName);

                        kendo.mobile.application.navigate("components/home/view.html");
                        kendo.bind($("#vwLogin"), kendo.observable({ isVisible: false }));
                        kendo.bind($("#vwLogout"), kendo.observable({ isVisible: true }));
                    } catch (e) {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>Datos Incorrectos");
                        //borraCamposlogin();
                        return;
                    }
                },
                error: function (err) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe de conexión con el servicio.");
                    return;
                }
            });
            return accResp;
        }
    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>Datos Incorrectos");
        return;
    }

}


// END_CUSTOM_CODE_login