export function errorMiddleware(err, req, res, next) {
    console.log(err);

    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Erro interno no servidor"
    })
}