export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          catalog_urls: string[] | null
          category: string
          created_at: string
          description: string | null
          id: string
          is_featured: boolean
          logo_url: string
          name: string
          sort_order: number
          updated_at: string
          website_url: string | null
        }
        Insert: {
          catalog_urls?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          logo_url: string
          name: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          catalog_urls?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string
          name?: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          contact: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          nif: string | null
          postal_code: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          nif?: string | null
          postal_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          nif?: string | null
          postal_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          background_image_url: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          links: Json | null
          location: string
          participants: number | null
          sponsors: number | null
          status: string
          time: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          links?: Json | null
          location: string
          participants?: number | null
          sponsors?: number | null
          status?: string
          time: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          background_image_url?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          links?: Json | null
          location?: string
          participants?: number | null
          sponsors?: number | null
          status?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_item_pilots: {
        Row: {
          created_at: string
          gallery_item_id: string
          id: string
          pilot_id: string
        }
        Insert: {
          created_at?: string
          gallery_item_id: string
          id?: string
          pilot_id: string
        }
        Update: {
          created_at?: string
          gallery_item_id?: string
          id?: string
          pilot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_item_pilots_gallery_item_id_fkey"
            columns: ["gallery_item_id"]
            isOneToOne: false
            referencedRelation: "gallery_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_item_pilots_pilot_id_fkey"
            columns: ["pilot_id"]
            isOneToOne: false
            referencedRelation: "pilots"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          album_id: string | null
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          album_id?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          album_id?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_slides: {
        Row: {
          button_text: string | null
          button_url: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      metrics: {
        Row: {
          change_text: string | null
          change_type: string | null
          created_at: string
          gradient_type: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          title: string
          updated_at: string
          value: string
        }
        Insert: {
          change_text?: string | null
          change_type?: string | null
          created_at?: string
          gradient_type?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string
          value: string
        }
        Update: {
          change_text?: string | null
          change_type?: string | null
          created_at?: string
          gradient_type?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      pilots: {
        Row: {
          bike_make: string | null
          bike_model: string | null
          biography: string | null
          birth_date: string | null
          championships: number | null
          created_at: string
          facebook: string | null
          id: string
          instagram: string | null
          is_active: boolean
          linkedin: string | null
          name: string
          nationality: string | null
          photo_url: string | null
          podiums: number | null
          sort_order: number | null
          team: string | null
          twitter: string | null
          updated_at: string
          victories: number | null
          website: string | null
        }
        Insert: {
          bike_make?: string | null
          bike_model?: string | null
          biography?: string | null
          birth_date?: string | null
          championships?: number | null
          created_at?: string
          facebook?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          linkedin?: string | null
          name: string
          nationality?: string | null
          photo_url?: string | null
          podiums?: number | null
          sort_order?: number | null
          team?: string | null
          twitter?: string | null
          updated_at?: string
          victories?: number | null
          website?: string | null
        }
        Update: {
          bike_make?: string | null
          bike_model?: string | null
          biography?: string | null
          birth_date?: string | null
          championships?: number | null
          created_at?: string
          facebook?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          linkedin?: string | null
          name?: string
          nationality?: string | null
          photo_url?: string | null
          podiums?: number | null
          sort_order?: number | null
          team?: string | null
          twitter?: string | null
          updated_at?: string
          victories?: number | null
          website?: string | null
        }
        Relationships: []
      }
      press_releases: {
        Row: {
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          code: string | null
          created_at: string
          description: string
          id: string
          unit: string
          unit_price: number
          updated_at: string
          vat_rate: number
        }
        Insert: {
          category_id?: string | null
          code?: string | null
          created_at?: string
          description: string
          id?: string
          unit?: string
          unit_price?: number
          updated_at?: string
          vat_rate?: number
        }
        Update: {
          category_id?: string | null
          code?: string | null
          created_at?: string
          description?: string
          id?: string
          unit?: string
          unit_price?: number
          updated_at?: string
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string
          description: string
          discount_percentage: number | null
          id: string
          product_id: string | null
          quantity: number
          quote_id: string
          sort_order: number | null
          subtotal: number | null
          unit: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          discount_percentage?: number | null
          id?: string
          product_id?: string | null
          quantity?: number
          quote_id: string
          sort_order?: number | null
          subtotal?: number | null
          unit?: string
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          discount_percentage?: number | null
          id?: string
          product_id?: string | null
          quantity?: number
          quote_id?: string
          sort_order?: number | null
          subtotal?: number | null
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          service_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          service_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          client_address: string | null
          client_contact: string | null
          client_id: string | null
          client_name: string
          client_nif: string | null
          client_postal_code: string | null
          created_at: string
          discount_percentage: number | null
          id: string
          include_general_conditions: boolean | null
          number: string
          observations: string | null
          payment_terms: string | null
          status: string | null
          template_id: string | null
          total_vat: number | null
          total_with_vat: number | null
          total_without_vat: number | null
          updated_at: string
          validity_date: string | null
          vat_rate: number
        }
        Insert: {
          client_address?: string | null
          client_contact?: string | null
          client_id?: string | null
          client_name: string
          client_nif?: string | null
          client_postal_code?: string | null
          created_at?: string
          discount_percentage?: number | null
          id?: string
          include_general_conditions?: boolean | null
          number: string
          observations?: string | null
          payment_terms?: string | null
          status?: string | null
          template_id?: string | null
          total_vat?: number | null
          total_with_vat?: number | null
          total_without_vat?: number | null
          updated_at?: string
          validity_date?: string | null
          vat_rate?: number
        }
        Update: {
          client_address?: string | null
          client_contact?: string | null
          client_id?: string | null
          client_name?: string
          client_nif?: string | null
          client_postal_code?: string | null
          created_at?: string
          discount_percentage?: number | null
          id?: string
          include_general_conditions?: boolean | null
          number?: string
          observations?: string | null
          payment_terms?: string | null
          status?: string | null
          template_id?: string | null
          total_vat?: number | null
          total_with_vat?: number | null
          total_without_vat?: number | null
          updated_at?: string
          validity_date?: string | null
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "quote_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          bike_info: string | null
          category: string | null
          created_at: string
          event_id: string
          id: string
          is_active: boolean
          observations: string | null
          pilot_id: string | null
          pilot_name: string
          points: number | null
          position: number
          time_result: string | null
          updated_at: string
        }
        Insert: {
          bike_info?: string | null
          category?: string | null
          created_at?: string
          event_id: string
          id?: string
          is_active?: boolean
          observations?: string | null
          pilot_id?: string | null
          pilot_name: string
          points?: number | null
          position: number
          time_result?: string | null
          updated_at?: string
        }
        Update: {
          bike_info?: string | null
          category?: string | null
          created_at?: string
          event_id?: string
          id?: string
          is_active?: boolean
          observations?: string | null
          pilot_id?: string | null
          pilot_name?: string
          points?: number | null
          position?: number
          time_result?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_results_event"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_pilot_id_fkey"
            columns: ["pilot_id"]
            isOneToOne: false
            referencedRelation: "pilots"
            referencedColumns: ["id"]
          },
        ]
      }
      route_locations: {
        Row: {
          created_at: string
          day: string
          id: string
          location_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day: string
          id?: string
          location_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          location_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      schedule_exceptions: {
        Row: {
          created_at: string
          custom_hours: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean
          is_closed: boolean
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_hours?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          is_closed?: boolean
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_hours?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          is_closed?: boolean
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shop_products: {
        Row: {
          brand_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          documents: Json | null
          id: string
          images: string[] | null
          is_active: boolean
          is_featured: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          price: number | null
          sale_price: number | null
          short_description: string | null
          sku: string | null
          slug: string
          sort_order: number
          specifications: Json | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price?: number | null
          sale_price?: number | null
          short_description?: string | null
          sku?: string | null
          slug: string
          sort_order?: number
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price?: number | null
          sale_price?: number | null
          short_description?: string | null
          sku?: string | null
          slug?: string
          sort_order?: number
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      showroom_gallery: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_featured: boolean
          sort_order: number
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_featured?: boolean
          sort_order?: number
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean
          sort_order?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          description: string | null
          facebook: string | null
          id: string
          instagram: string | null
          is_active: boolean
          linkedin: string | null
          logo_url: string
          name: string
          sort_order: number | null
          twitter: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          linkedin?: string | null
          logo_url: string
          name: string
          sort_order?: number | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          linkedin?: string | null
          logo_url?: string
          name?: string
          sort_order?: number | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      template_items: {
        Row: {
          created_at: string
          description: string
          id: string
          product_id: string | null
          quantity: number
          sort_order: number | null
          template_id: string
          unit: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          product_id?: string | null
          quantity?: number
          sort_order?: number | null
          template_id: string
          unit?: string
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          product_id?: string | null
          quantity?: number
          sort_order?: number | null
          template_id?: string
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "template_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "quote_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      youtube_videos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          youtube_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
