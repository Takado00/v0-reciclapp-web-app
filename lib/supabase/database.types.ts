export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          nombre: string
          descripcion?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          nombre?: string
          descripcion?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          id: string
          nombre: string
          correo: string
          contrasena: string
          rol_id: number | null
          telefono: string | null
          direccion: string | null
          ciudad: string | null
          fecha_registro: string | null
          ultima_conexion: string | null
          activo: boolean | null
          descripcion: string | null
          sitio_web: string | null
          foto_perfil: string | null
          redes_sociales: Json | null
          intereses_reciclaje: string[] | null
          certificaciones: string[] | null
          materiales_aceptados: string[] | null
          horario_atencion: string | null
          especialidad: string | null
          nivel_experiencia: string | null
          biografia: string | null
          educacion: string | null
          anos_experiencia: number | null
          areas_servicio: string[] | null
        }
        Insert: {
          id?: string
          nombre: string
          correo: string
          contrasena: string
          rol_id?: number | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          fecha_registro?: string | null
          ultima_conexion?: string | null
          activo?: boolean | null
          descripcion?: string | null
          sitio_web?: string | null
          foto_perfil?: string | null
          redes_sociales?: Json | null
          intereses_reciclaje?: string[] | null
          certificaciones?: string[] | null
          materiales_aceptados?: string[] | null
          horario_atencion?: string | null
          especialidad?: string | null
          nivel_experiencia?: string | null
          biografia?: string | null
          educacion?: string | null
          anos_experiencia?: number | null
          areas_servicio?: string[] | null
        }
        Update: {
          id?: string
          nombre?: string
          correo?: string
          contrasena?: string
          rol_id?: number | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          fecha_registro?: string | null
          ultima_conexion?: string | null
          activo?: boolean | null
          descripcion?: string | null
          sitio_web?: string | null
          foto_perfil?: string | null
          redes_sociales?: Json | null
          intereses_reciclaje?: string[] | null
          certificaciones?: string[] | null
          materiales_aceptados?: string[] | null
          horario_atencion?: string | null
          especialidad?: string | null
          nivel_experiencia?: string | null
          biografia?: string | null
          educacion?: string | null
          anos_experiencia?: number | null
          areas_servicio?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_rol_id_fkey"
            columns: ["rol_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      materiales: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
          categoria: string
          imagen_url: string | null
          precio_estimado: number | null
          unidad_medida: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          nombre: string
          descripcion?: string | null
          categoria: string
          imagen_url?: string | null
          precio_estimado?: number | null
          unidad_medida?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          nombre?: string
          descripcion?: string | null
          categoria?: string
          imagen_url?: string | null
          precio_estimado?: number | null
          unidad_medida?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ubicaciones: {
        Row: {
          id: number
          nombre: string
          direccion: string
          latitud: number | null
          longitud: number | null
          tipo: string | null
          horario: string | null
          telefono: string | null
          usuario_id: string | null
          materiales_aceptados: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          nombre: string
          direccion: string
          latitud?: number | null
          longitud?: number | null
          tipo?: string | null
          horario?: string | null
          telefono?: string | null
          usuario_id?: string | null
          materiales_aceptados?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          nombre?: string
          direccion?: string
          latitud?: number | null
          longitud?: number | null
          tipo?: string | null
          horario?: string | null
          telefono?: string | null
          usuario_id?: string | null
          materiales_aceptados?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ubicaciones_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      publicaciones: {
        Row: {
          id: number
          usuario_id: string | null
          material_id: number | null
          titulo: string
          descripcion: string | null
          cantidad: number | null
          unidad_medida: string | null
          precio: number | null
          ubicacion_id: number | null
          imagen_url: string | null
          estado: string | null
          fecha_publicacion: string | null
          fecha_actualizacion: string | null
        }
        Insert: {
          id?: number
          usuario_id?: string | null
          material_id?: number | null
          titulo: string
          descripcion?: string | null
          cantidad?: number | null
          unidad_medida?: string | null
          precio?: number | null
          ubicacion_id?: number | null
          imagen_url?: string | null
          estado?: string | null
          fecha_publicacion?: string | null
          fecha_actualizacion?: string | null
        }
        Update: {
          id?: number
          usuario_id?: string | null
          material_id?: number | null
          titulo?: string
          descripcion?: string | null
          cantidad?: number | null
          unidad_medida?: string | null
          precio?: number | null
          ubicacion_id?: number | null
          imagen_url?: string | null
          estado?: string | null
          fecha_publicacion?: string | null
          fecha_actualizacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publicaciones_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicaciones_ubicacion_id_fkey"
            columns: ["ubicacion_id"]
            referencedRelation: "ubicaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicaciones_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      transacciones: {
        Row: {
          id: number
          publicacion_id: number | null
          comprador_id: string | null
          vendedor_id: string | null
          cantidad: number | null
          precio_total: number | null
          estado: string | null
          fecha_transaccion: string | null
          fecha_actualizacion: string | null
        }
        Insert: {
          id?: number
          publicacion_id?: number | null
          comprador_id?: string | null
          vendedor_id?: string | null
          cantidad?: number | null
          precio_total?: number | null
          estado?: string | null
          fecha_transaccion?: string | null
          fecha_actualizacion?: string | null
        }
        Update: {
          id?: number
          publicacion_id?: number | null
          comprador_id?: string | null
          vendedor_id?: string | null
          cantidad?: number | null
          precio_total?: number | null
          estado?: string | null
          fecha_transaccion?: string | null
          fecha_actualizacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_comprador_id_fkey"
            columns: ["comprador_id"]
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_publicacion_id_fkey"
            columns: ["publicacion_id"]
            referencedRelation: "publicaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_vendedor_id_fkey"
            columns: ["vendedor_id"]
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          id: number
          usuario_id: string | null
          material_id: number | null
          cantidad: number | null
          unidad_medida: string | null
          precio_ofrecido: number | null
          descripcion: string | null
          estado: string | null
          fecha_pedido: string | null
          fecha_actualizacion: string | null
        }
        Insert: {
          id?: number
          usuario_id?: string | null
          material_id?: number | null
          cantidad?: number | null
          unidad_medida?: string | null
          precio_ofrecido?: number | null
          descripcion?: string | null
          estado?: string | null
          fecha_pedido?: string | null
          fecha_actualizacion?: string | null
        }
        Update: {
          id?: number
          usuario_id?: string | null
          material_id?: number | null
          cantidad?: number | null
          unidad_medida?: string | null
          precio_ofrecido?: number | null
          descripcion?: string | null
          estado?: string | null
          fecha_pedido?: string | null
          fecha_actualizacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      valoraciones: {
        Row: {
          id: number
          usuario_id: string | null
          publicacion_id: number | null
          calificacion: number | null
          comentario: string | null
          fecha_valoracion: string | null
        }
        Insert: {
          id?: number
          usuario_id?: string | null
          publicacion_id?: number | null
          calificacion?: number | null
          comentario?: string | null
          fecha_valoracion?: string | null
        }
        Update: {
          id?: number
          usuario_id?: string | null
          publicacion_id?: number | null
          calificacion?: number | null
          comentario?: string | null
          fecha_valoracion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valoraciones_publicacion_id_fkey"
            columns: ["publicacion_id"]
            referencedRelation: "publicaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valoraciones_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones: {
        Row: {
          id: number
          usuario_id: string | null
          titulo: string
          mensaje: string
          leida: boolean | null
          tipo: string | null
          referencia_id: number | null
          fecha_creacion: string | null
        }
        Insert: {
          id?: number
          usuario_id?: string | null
          titulo: string
          mensaje: string
          leida?: boolean | null
          tipo?: string | null
          referencia_id?: number | null
          fecha_creacion?: string | null
        }
        Update: {
          id?: number
          usuario_id?: string | null
          titulo?: string
          mensaje?: string
          leida?: boolean | null
          tipo?: string | null
          referencia_id?: number | null
          fecha_creacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      historial: {
        Row: {
          id: number
          usuario_id: string | null
          accion: string
          descripcion: string | null
          entidad: string | null
          entidad_id: number | null
          fecha_accion: string | null
        }
        Insert: {
          id?: number
          usuario_id?: string | null
          accion: string
          descripcion?: string | null
          entidad?: string | null
          entidad_id?: number | null
          fecha_accion?: string | null
        }
        Update: {
          id?: number
          usuario_id?: string | null
          accion?: string
          descripcion?: string | null
          entidad?: string | null
          entidad_id?: number | null
          fecha_accion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historial_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
