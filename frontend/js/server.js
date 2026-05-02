const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    // 127.0.0.1 evita problemas comunes de IPv6 (::1) en entornos locales Windows.
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hub_educativo_colombia',
    waitForConnections: true,
    connectionLimit: 10
});

const manejarError = (res, error, mensaje = 'Error interno del servidor') => {
    console.error(error);
    res.status(500).json({ mensaje, detalle: error.message });
};

const mapInstitucion = (fila) => ({
    idInstitucion: fila.id_institucion,
    nombreOficial: fila.nombre_oficial,
    naturaleza: fila.naturaleza,
    sitioWeb: fila.sitio_web,
    fechaRegistro: fila.fecha_registro
});

const mapSede = (fila) => ({
    idSede: fila.id_sede,
    idInstitucion: fila.id_institucion,
    nombreSede: fila.nombre_sede,
    ciudad: fila.ciudad,
    direccionFisica: fila.direccion_fisica,
    esSedePrincipal: Boolean(fila.es_sede_principal)
});

const mapUsuario = (fila) => ({
    idUsuario: fila.id_usuario,
    nombreCompleto: fila.nombre_completo,
    correoElectronico: fila.correo_electronico,
    hashContrasena: fila.hash_contrasena,
    rol: fila.rol,
    estaActivo: Boolean(fila.esta_activo),
    fechaCreacion: fila.fecha_creacion,
    fechaModificacion: fila.fecha_modificacion
});

const mapPrograma = (fila) => ({
    idPrograma: fila.id_programa,
    idInstitucion: fila.id_institucion,
    codigoSnies: fila.codigo_snies,
    nombrePrograma: fila.nombre_programa,
    nivelFormacion: fila.nivel_formacion,
    totalSemestres: fila.total_semestres,
    estaActivo: Boolean(fila.esta_activo)
});

const mapDetalle = (fila) => ({
    idDetalle: fila.id_detalle,
    idPrograma: fila.id_programa,
    costoSemestre: Number(fila.costo_semestre),
    modalidad: fila.modalidad,
    jornada: fila.jornada,
    estudiantesActivos: fila.estudiantes_activos,
    fechaActualizacion: fila.fecha_actualizacion
});

const mapCalidad = (fila) => ({
    idBeneficio: fila.id_beneficio,
    idPrograma: fila.id_programa,
    acreditacionAltaCalidad: Boolean(fila.acreditacion_alta_calidad),
    ofreceBecas: Boolean(fila.ofrece_becas),
    dobleTitulacion: Boolean(fila.doble_titulacion),
    requiereSegundoIdioma: Boolean(fila.requiere_segundo_idioma)
});

app.get('/api/health', async (_req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ ok: true, mensaje: 'API y base de datos disponibles' });
    } catch (error) {
        manejarError(res, error, 'No se pudo conectar con la base de datos');
    }
});

app.get('/api/sincronizacion', async (_req, res) => {
    try {
        const [instituciones] = await pool.query('SELECT * FROM instituciones ORDER BY id_institucion');
        const [sedes] = await pool.query('SELECT * FROM sedes_institucion ORDER BY id_sede');
        const [usuarios] = await pool.query('SELECT * FROM usuarios ORDER BY id_usuario');
        const [programas] = await pool.query('SELECT * FROM programas_academicos ORDER BY id_programa');
        const [detalles] = await pool.query('SELECT * FROM detalles_operacion ORDER BY id_detalle');
        const [calidad] = await pool.query('SELECT * FROM calidad_beneficios ORDER BY id_beneficio');

        res.json({
            instituciones: instituciones.map(mapInstitucion),
            sedesInstitucion: sedes.map(mapSede),
            usuarios: usuarios.map(mapUsuario),
            programasAcademicos: programas.map(mapPrograma),
            detallesOperacion: detalles.map(mapDetalle),
            calidadBeneficios: calidad.map(mapCalidad)
        });
    } catch (error) {
        manejarError(res, error, 'No fue posible sincronizar los datos');
    }
});

app.post('/api/instituciones', async (req, res) => {
    try {
        const { nombreOficial, naturaleza, sitioWeb } = req.body;
        const [resultado] = await pool.query(
            'INSERT INTO instituciones (nombre_oficial, naturaleza, sitio_web) VALUES (?, ?, ?)',
            [nombreOficial, naturaleza, sitioWeb || null]
        );
        res.status(201).json({ idInstitucion: resultado.insertId });
    } catch (error) {
        manejarError(res, error, 'No se pudo crear la institución');
    }
});

app.put('/api/instituciones/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombreOficial, naturaleza, sitioWeb } = req.body;
        const [resultado] = await pool.query(
            'UPDATE instituciones SET nombre_oficial = ?, naturaleza = ?, sitio_web = ? WHERE id_institucion = ?',
            [nombreOficial, naturaleza, sitioWeb || null, id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Institución no encontrada' });
        }
        res.json({ mensaje: 'Institución actualizada' });
    } catch (error) {
        manejarError(res, error, 'No se pudo actualizar la institución');
    }
});

app.delete('/api/instituciones/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [resultado] = await pool.query('DELETE FROM instituciones WHERE id_institucion = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Institución no encontrada' });
        }
        res.json({ mensaje: 'Institución eliminada' });
    } catch (error) {
        manejarError(res, error, 'No se pudo eliminar la institución');
    }
});

app.post('/api/sedes', async (req, res) => {
    try {
        const { idInstitucion, nombreSede, ciudad, direccionFisica, esSedePrincipal } = req.body;
        const [resultado] = await pool.query(
            `INSERT INTO sedes_institucion
             (id_institucion, nombre_sede, ciudad, direccion_fisica, es_sede_principal)
             VALUES (?, ?, ?, ?, ?)`,
            [idInstitucion, nombreSede, ciudad, direccionFisica, esSedePrincipal ? 1 : 0]
        );
        res.status(201).json({ idSede: resultado.insertId });
    } catch (error) {
        manejarError(res, error, 'No se pudo crear la sede');
    }
});

app.post('/api/usuarios', async (req, res) => {
    try {
        const {
            nombreCompleto,
            correoElectronico,
            hashContrasena,
            rol,
            estaActivo
        } = req.body;

        const [resultado] = await pool.query(
            `INSERT INTO usuarios
             (nombre_completo, correo_electronico, hash_contrasena, rol, esta_activo)
             VALUES (?, ?, ?, ?, ?)`,
            [nombreCompleto, correoElectronico, hashContrasena || '$2b$12$hashPorDefecto', rol, estaActivo ? 1 : 0]
        );
        res.status(201).json({ idUsuario: resultado.insertId });
    } catch (error) {
        manejarError(res, error, 'No se pudo crear el usuario');
    }
});

app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombreCompleto, correoElectronico, rol, estaActivo } = req.body;
        const [resultado] = await pool.query(
            `UPDATE usuarios
             SET nombre_completo = ?, correo_electronico = ?, rol = ?, esta_activo = ?
             WHERE id_usuario = ?`,
            [nombreCompleto, correoElectronico, rol, estaActivo ? 1 : 0, id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario actualizado' });
    } catch (error) {
        manejarError(res, error, 'No se pudo actualizar el usuario');
    }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [resultado] = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        manejarError(res, error, 'No se pudo eliminar el usuario');
    }
});

app.post('/api/programas', async (req, res) => {
    const conexion = await pool.getConnection();
    try {
        const {
            idInstitucion,
            codigoSnies,
            nombrePrograma,
            nivelFormacion,
            totalSemestres,
            costoSemestre,
            modalidad,
            jornada,
            estudiantesActivos,
            acreditacionAltaCalidad,
            ofreceBecas,
            dobleTitulacion,
            requiereSegundoIdioma
        } = req.body;

        await conexion.beginTransaction();

        const [nuevoPrograma] = await conexion.query(
            `INSERT INTO programas_academicos
             (id_institucion, codigo_snies, nombre_programa, nivel_formacion, total_semestres)
             VALUES (?, ?, ?, ?, ?)`,
            [idInstitucion, codigoSnies, nombrePrograma, nivelFormacion, totalSemestres]
        );

        const idPrograma = nuevoPrograma.insertId;

        await conexion.query(
            `INSERT INTO detalles_operacion
             (id_programa, costo_semestre, modalidad, jornada, estudiantes_activos)
             VALUES (?, ?, ?, ?, ?)`,
            [idPrograma, costoSemestre, modalidad, jornada, estudiantesActivos]
        );

        await conexion.query(
            `INSERT INTO calidad_beneficios
             (id_programa, acreditacion_alta_calidad, ofrece_becas, doble_titulacion, requiere_segundo_idioma)
             VALUES (?, ?, ?, ?, ?)`,
            [idPrograma, acreditacionAltaCalidad ? 1 : 0, ofreceBecas ? 1 : 0, dobleTitulacion ? 1 : 0, requiereSegundoIdioma ? 1 : 0]
        );

        await conexion.commit();
        res.status(201).json({ idPrograma });
    } catch (error) {
        await conexion.rollback();
        manejarError(res, error, 'No se pudo crear el programa');
    } finally {
        conexion.release();
    }
});

app.put('/api/programas/:id', async (req, res) => {
    const conexion = await pool.getConnection();
    try {
        const id = Number(req.params.id);
        const {
            idInstitucion,
            codigoSnies,
            nombrePrograma,
            nivelFormacion,
            totalSemestres,
            costoSemestre,
            modalidad,
            jornada,
            estudiantesActivos,
            acreditacionAltaCalidad,
            ofreceBecas,
            dobleTitulacion,
            requiereSegundoIdioma
        } = req.body;

        await conexion.beginTransaction();

        const [programa] = await conexion.query(
            `UPDATE programas_academicos
             SET id_institucion = ?, codigo_snies = ?, nombre_programa = ?, nivel_formacion = ?, total_semestres = ?
             WHERE id_programa = ?`,
            [idInstitucion, codigoSnies, nombrePrograma, nivelFormacion, totalSemestres, id]
        );

        if (programa.affectedRows === 0) {
            await conexion.rollback();
            return res.status(404).json({ mensaje: 'Programa no encontrado' });
        }

        await conexion.query(
            `UPDATE detalles_operacion
             SET costo_semestre = ?, modalidad = ?, jornada = ?, estudiantes_activos = ?
             WHERE id_programa = ?`,
            [costoSemestre, modalidad, jornada, estudiantesActivos, id]
        );

        await conexion.query(
            `UPDATE calidad_beneficios
             SET acreditacion_alta_calidad = ?, ofrece_becas = ?, doble_titulacion = ?, requiere_segundo_idioma = ?
             WHERE id_programa = ?`,
            [acreditacionAltaCalidad ? 1 : 0, ofreceBecas ? 1 : 0, dobleTitulacion ? 1 : 0, requiereSegundoIdioma ? 1 : 0, id]
        );

        await conexion.commit();
        res.json({ mensaje: 'Programa actualizado' });
    } catch (error) {
        await conexion.rollback();
        manejarError(res, error, 'No se pudo actualizar el programa');
    } finally {
        conexion.release();
    }
});

app.delete('/api/programas/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [resultado] = await pool.query('DELETE FROM programas_academicos WHERE id_programa = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Programa no encontrado' });
        }
        res.json({ mensaje: 'Programa eliminado' });
    } catch (error) {
        manejarError(res, error, 'No se pudo eliminar el programa');
    }
});

app.listen(PUERTO, () => {
    console.log(`Servidor API corriendo en http://localhost:${PUERTO}`);
});