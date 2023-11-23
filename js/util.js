function ehValor(numero) {
    try {
        Number(numero);
        return true;
    } catch(e) {
        return false;
    }
}