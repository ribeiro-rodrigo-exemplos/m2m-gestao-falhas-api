var cacheMotoristas = function cacheMotoristas() {
    var motoristas = {};
    var exibeNomeMotorista = 1;

    this.addMotorista = function(key, objMotorista) {
        motoristas[key] = objMotorista;
    };

    this.getMotoristas = function() {
        return motoristas;
    };

    this.clearMotoristas = function() {
        motoristas = {};
    };

    if(cacheMotoristas.caller != cacheMotoristas.getInstance) {
        throw new Error("This object cannot be instanciated");
    }
}
 
cacheMotoristas.instance = null;
 
cacheMotoristas.getInstance = function() {
    if(this.instance === null) {
        this.instance = new cacheMotoristas();
    }
    return this.instance;
}
 
module.exports = cacheMotoristas.getInstance();
