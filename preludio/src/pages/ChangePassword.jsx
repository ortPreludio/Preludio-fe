import { useState } from "react";

export default function ChangePassword() {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null); // Limpiamos errores y mensajes al iniciar
        setMessage(null); // Limpiamos errores y mensajes al iniciar


        if (newPassword !== confirmPassword) {
            setError("Las contraseñas nuevas no coinciden.");
            return;
        }

        // Opcional: Validar que la nueva contraseña no esté vacía
        if (newPassword.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/users/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    // 2. ELIMINAMOS EL HEADER DE AUTHORIZATION. La autenticación
                    // se realizará automáticamente con la cookie del navegador.
                    // Authorization: `Bearer ${token}`, // <- ELIMINADO
                },
                // 3. AÑADIMOS 'credentials: "include"' para asegurar que la cookie
                // de sesión (que contiene el token) sea enviada.
                credentials: "include",
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // El backend ahora usa 'message' para errores de contraseña incorrecta
                setError(data.message || data.error || "Error al cambiar la contraseña");
            } else {
                setMessage("La contraseña fue actualizada correctamente.");
                // Opcional: Volver a iniciar sesión o forzar logout después de un cambio exitoso
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            console.error(err);
            setError("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: "450px", margin: "0 auto" }}>
            <h2>Cambiar contraseña</h2>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
                <div>
                    <label>Contraseña actual</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="input"
                    />
                </div>

                <div>
                    <label>Nueva contraseña</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="input"
                    />
                </div>

                <div>
                    <label>Confirmar nueva contraseña</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="input"
                    />
                </div>

                {error && (
                    <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
                )}

                {message && (
                    <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? "Guardando..." : "Cambiar contraseña"}
                </button>
            </form>
        </div>
    );
}