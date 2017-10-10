'use strict';

app.home = kendo.observable({
    onShow: function () {

        homeInfo()
    },
    afterShow: function() {}
});
app.localization.registerView('home');

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

function homeInfo() {


    var homeUsuario = JSON.parse(localStorage.getItem('Inp_DatosUsuario'));




    //document.getElementById("persona_nombre").value = homeUsuario.persona_nombre;
    //document.getElementById("persona_apellido").value = homeUsuario.persona_apellido;
    //document.getElementById("mail").value = homeUsuario.mail;
    //document.getElementById("telefono_celular").value = homeUsuario.telefono_celular;






    //alert(homeUsuario.chasis);
    //alert('hola');

}


// END_CUSTOM_CODE_home