export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activities: {
        Row: {
          body: string | null
          company_id: string | null
          created_at: string
          direction: Database["public"]["Enums"]["interaction_direction"] | null
          id: string
          is_interaction: boolean
          meeting_id: string | null
          metadata: Json
          occurred_at: string
          opportunity_id: string | null
          person_id: string | null
          related_person_id: string | null
          source: Database["public"]["Enums"]["record_origin"]
          summary: string
          task_id: string | null
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string
        }
        Insert: {
          body?: string | null
          company_id?: string | null
          created_at?: string
          direction?:
            | Database["public"]["Enums"]["interaction_direction"]
            | null
          id?: string
          is_interaction?: boolean
          meeting_id?: string | null
          metadata?: Json
          occurred_at?: string
          opportunity_id?: string | null
          person_id?: string | null
          related_person_id?: string | null
          source?: Database["public"]["Enums"]["record_origin"]
          summary: string
          task_id?: string | null
          type: Database["public"]["Enums"]["activity_type"]
          user_id?: string
        }
        Update: {
          body?: string | null
          company_id?: string | null
          created_at?: string
          direction?:
            | Database["public"]["Enums"]["interaction_direction"]
            | null
          id?: string
          is_interaction?: boolean
          meeting_id?: string | null
          metadata?: Json
          occurred_at?: string
          opportunity_id?: string | null
          person_id?: string | null
          related_person_id?: string | null
          source?: Database["public"]["Enums"]["record_origin"]
          summary?: string
          task_id?: string | null
          type?: Database["public"]["Enums"]["activity_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "activities_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_ageing"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "activities_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
          {
            foreignKeyName: "activities_related_person_id_fkey"
            columns: ["related_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_related_person_id_fkey"
            columns: ["related_person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
          {
            foreignKeyName: "activities_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "person_next_follow_up"
            referencedColumns: ["task_id"]
          },
          {
            foreignKeyName: "activities_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_runs: {
        Row: {
          created_at: string
          feature: string
          id: string
          input_refs: Json
          mode: string
          model: string | null
          output: Json | null
          prompt: string | null
          status: string
          tokens_in: number | null
          tokens_out: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feature: string
          id?: string
          input_refs?: Json
          mode?: string
          model?: string | null
          output?: Json | null
          prompt?: string | null
          status?: string
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string
        }
        Update: {
          created_at?: string
          feature?: string
          id?: string
          input_refs?: Json
          mode?: string
          model?: string | null
          output?: Json | null
          prompt?: string | null
          status?: string
          tokens_in?: number | null
          tokens_out?: number | null
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          archived_at: string | null
          careers_url: string | null
          created_at: string
          hq: string | null
          id: string
          name: string
          offices: string[]
          one_liner: string | null
          priority: Database["public"]["Enums"]["priority_level"]
          status: Database["public"]["Enums"]["company_status"]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          archived_at?: string | null
          careers_url?: string | null
          created_at?: string
          hq?: string | null
          id?: string
          name: string
          offices?: string[]
          one_liner?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Update: {
          archived_at?: string | null
          careers_url?: string | null
          created_at?: string
          hq?: string | null
          id?: string
          name?: string
          offices?: string[]
          one_liner?: string | null
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      company_groups: {
        Row: {
          archived_at: string | null
          careers_url: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_focus: boolean
          locations: string[]
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          careers_url?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_focus?: boolean
          locations?: string[]
          name: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          archived_at?: string | null
          careers_url?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_focus?: boolean
          locations?: string[]
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_groups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_groups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_industries: {
        Row: {
          company_id: string
          industry_id: string
          user_id: string
        }
        Insert: {
          company_id: string
          industry_id: string
          user_id?: string
        }
        Update: {
          company_id?: string
          industry_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_industries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_industries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      document_links: {
        Row: {
          company_id: string | null
          created_at: string
          document_id: string
          id: string
          meeting_id: string | null
          opportunity_id: string | null
          person_id: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          document_id: string
          id?: string
          meeting_id?: string | null
          opportunity_id?: string | null
          person_id?: string | null
          user_id?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          document_id?: string
          id?: string
          meeting_id?: string | null
          opportunity_id?: string | null
          person_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_links_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_links_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "document_links_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_links_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_links_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_links_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_ageing"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "document_links_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_links_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
        ]
      }
      documents: {
        Row: {
          archived_at: string | null
          created_at: string
          extracted_text: string | null
          id: string
          is_master: boolean
          kind: Database["public"]["Enums"]["document_kind"]
          mime_type: string | null
          storage_path: string
          title: string
          updated_at: string
          user_id: string
          version_label: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          extracted_text?: string | null
          id?: string
          is_master?: boolean
          kind?: Database["public"]["Enums"]["document_kind"]
          mime_type?: string | null
          storage_path: string
          title: string
          updated_at?: string
          user_id?: string
          version_label?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          extracted_text?: string | null
          id?: string
          is_master?: boolean
          kind?: Database["public"]["Enums"]["document_kind"]
          mime_type?: string | null
          storage_path?: string
          title?: string
          updated_at?: string
          user_id?: string
          version_label?: string | null
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string
          id: string
          name: string
          priority: Database["public"]["Enums"]["priority_level"]
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          priority?: Database["public"]["Enums"]["priority_level"]
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      insights: {
        Row: {
          category: Database["public"]["Enums"]["insight_category"]
          company_id: string | null
          content: string
          created_at: string
          group_id: string | null
          id: string
          meeting_id: string | null
          occurred_at: string
          person_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["insight_category"]
          company_id?: string | null
          content: string
          created_at?: string
          group_id?: string | null
          id?: string
          meeting_id?: string | null
          occurred_at?: string
          person_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["insight_category"]
          company_id?: string | null
          content?: string
          created_at?: string
          group_id?: string | null
          id?: string
          meeting_id?: string | null
          occurred_at?: string
          person_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insights_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "insights_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "company_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insights_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insights_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insights_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
        ]
      }
      meeting_participants: {
        Row: {
          meeting_id: string
          person_id: string
          role: Database["public"]["Enums"]["participant_role"]
          user_id: string
        }
        Insert: {
          meeting_id: string
          person_id: string
          role?: Database["public"]["Enums"]["participant_role"]
          user_id?: string
        }
        Update: {
          meeting_id?: string
          person_id?: string
          role?: Database["public"]["Enums"]["participant_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_participants_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_participants_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
        ]
      }
      meetings: {
        Row: {
          archived_at: string | null
          company_id: string | null
          created_at: string
          debrief_proposal: Json | null
          debriefed_at: string | null
          ends_at: string | null
          group_id: string | null
          id: string
          location: string | null
          objective: string | null
          opportunity_id: string | null
          raw_notes: string | null
          starts_at: string
          status: Database["public"]["Enums"]["meeting_status"]
          summary: string | null
          title: string
          type: Database["public"]["Enums"]["meeting_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          company_id?: string | null
          created_at?: string
          debrief_proposal?: Json | null
          debriefed_at?: string | null
          ends_at?: string | null
          group_id?: string | null
          id?: string
          location?: string | null
          objective?: string | null
          opportunity_id?: string | null
          raw_notes?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["meeting_status"]
          summary?: string | null
          title: string
          type?: Database["public"]["Enums"]["meeting_type"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          archived_at?: string | null
          company_id?: string | null
          created_at?: string
          debrief_proposal?: Json | null
          debriefed_at?: string | null
          ends_at?: string | null
          group_id?: string | null
          id?: string
          location?: string | null
          objective?: string | null
          opportunity_id?: string | null
          raw_notes?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["meeting_status"]
          summary?: string | null
          title?: string
          type?: Database["public"]["Enums"]["meeting_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "meetings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "company_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_ageing"
            referencedColumns: ["opportunity_id"]
          },
        ]
      }
      opportunities: {
        Row: {
          applied_at: string | null
          archived_at: string | null
          company_id: string | null
          created_at: string
          deadline: string | null
          group_id: string | null
          id: string
          job_url: string | null
          kind: Database["public"]["Enums"]["opportunity_kind"]
          location: string | null
          outcome: Database["public"]["Enums"]["opportunity_outcome"] | null
          priority: Database["public"]["Enums"]["priority_level"]
          source_meeting_id: string | null
          source_person_id: string | null
          stage: Database["public"]["Enums"]["opportunity_stage"]
          stage_changed_at: string
          state: Database["public"]["Enums"]["opportunity_state"]
          summary: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          archived_at?: string | null
          company_id?: string | null
          created_at?: string
          deadline?: string | null
          group_id?: string | null
          id?: string
          job_url?: string | null
          kind: Database["public"]["Enums"]["opportunity_kind"]
          location?: string | null
          outcome?: Database["public"]["Enums"]["opportunity_outcome"] | null
          priority?: Database["public"]["Enums"]["priority_level"]
          source_meeting_id?: string | null
          source_person_id?: string | null
          stage: Database["public"]["Enums"]["opportunity_stage"]
          stage_changed_at?: string
          state?: Database["public"]["Enums"]["opportunity_state"]
          summary?: string | null
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          applied_at?: string | null
          archived_at?: string | null
          company_id?: string | null
          created_at?: string
          deadline?: string | null
          group_id?: string | null
          id?: string
          job_url?: string | null
          kind?: Database["public"]["Enums"]["opportunity_kind"]
          location?: string | null
          outcome?: Database["public"]["Enums"]["opportunity_outcome"] | null
          priority?: Database["public"]["Enums"]["priority_level"]
          source_meeting_id?: string | null
          source_person_id?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          stage_changed_at?: string
          state?: Database["public"]["Enums"]["opportunity_state"]
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "opportunities_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "company_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_source_meeting_fk"
            columns: ["source_meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_source_person_id_fkey"
            columns: ["source_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_source_person_id_fkey"
            columns: ["source_person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
        ]
      }
      opportunity_people: {
        Row: {
          opportunity_id: string
          person_id: string
          role: Database["public"]["Enums"]["opportunity_person_role"]
          user_id: string
        }
        Insert: {
          opportunity_id: string
          person_id: string
          role?: Database["public"]["Enums"]["opportunity_person_role"]
          user_id?: string
        }
        Update: {
          opportunity_id?: string
          person_id?: string
          role?: Database["public"]["Enums"]["opportunity_person_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_people_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_people_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_ageing"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "opportunity_people_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_people_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
        ]
      }
      people: {
        Row: {
          archived_at: string | null
          background: string | null
          company_id: string | null
          created_at: string
          email: string | null
          follow_up_cadence_days: number | null
          full_name: string
          group_id: string | null
          how_we_met: string | null
          id: string
          introduced_by_person_id: string | null
          linkedin_url: string | null
          location: string | null
          personal_notes: string | null
          phone: string | null
          preferred_name: string | null
          relationship_stage: Database["public"]["Enums"]["relationship_stage"]
          source: Database["public"]["Enums"]["person_source"]
          stage_changed_at: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          background?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          follow_up_cadence_days?: number | null
          full_name: string
          group_id?: string | null
          how_we_met?: string | null
          id?: string
          introduced_by_person_id?: string | null
          linkedin_url?: string | null
          location?: string | null
          personal_notes?: string | null
          phone?: string | null
          preferred_name?: string | null
          relationship_stage?: Database["public"]["Enums"]["relationship_stage"]
          source?: Database["public"]["Enums"]["person_source"]
          stage_changed_at?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          archived_at?: string | null
          background?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          follow_up_cadence_days?: number | null
          full_name?: string
          group_id?: string | null
          how_we_met?: string | null
          id?: string
          introduced_by_person_id?: string | null
          linkedin_url?: string | null
          location?: string | null
          personal_notes?: string | null
          phone?: string | null
          preferred_name?: string | null
          relationship_stage?: Database["public"]["Enums"]["relationship_stage"]
          source?: Database["public"]["Enums"]["person_source"]
          stage_changed_at?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "people_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "company_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_introduced_by_person_id_fkey"
            columns: ["introduced_by_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_introduced_by_person_id_fkey"
            columns: ["introduced_by_person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
        ]
      }
      profiles: {
        Row: {
          application_chase_after: number
          background_summary: string | null
          created_at: string
          default_follow_up_cadence: number
          display_name: string | null
          email_signature: string | null
          master_cv_document_id: string | null
          outreach_nudge_after: number
          speculative_stale_after: number
          target_roles: string | null
          thank_you_within: number
          tone_notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_chase_after?: number
          background_summary?: string | null
          created_at?: string
          default_follow_up_cadence?: number
          display_name?: string | null
          email_signature?: string | null
          master_cv_document_id?: string | null
          outreach_nudge_after?: number
          speculative_stale_after?: number
          target_roles?: string | null
          thank_you_within?: number
          tone_notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          application_chase_after?: number
          background_summary?: string | null
          created_at?: string
          default_follow_up_cadence?: number
          display_name?: string | null
          email_signature?: string | null
          master_cv_document_id?: string | null
          outreach_nudge_after?: number
          speculative_stale_after?: number
          target_roles?: string | null
          thank_you_within?: number
          tone_notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_master_cv_fk"
            columns: ["master_cv_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      report_sources: {
        Row: {
          id: string
          published_at: string | null
          publisher: string | null
          report_id: string
          retrieved_at: string
          title: string | null
          url: string
          user_id: string
        }
        Insert: {
          id?: string
          published_at?: string | null
          publisher?: string | null
          report_id: string
          retrieved_at?: string
          title?: string | null
          url: string
          user_id?: string
        }
        Update: {
          id?: string
          published_at?: string | null
          publisher?: string | null
          report_id?: string
          retrieved_at?: string
          title?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_sources_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          company_id: string | null
          created_at: string
          error: string | null
          generated_at: string | null
          group_id: string | null
          id: string
          is_current: boolean
          kind: Database["public"]["Enums"]["report_kind"]
          meeting_id: string | null
          model: string | null
          opportunity_id: string | null
          person_id: string | null
          sections: Json
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          error?: string | null
          generated_at?: string | null
          group_id?: string | null
          id?: string
          is_current?: boolean
          kind: Database["public"]["Enums"]["report_kind"]
          meeting_id?: string | null
          model?: string | null
          opportunity_id?: string | null
          person_id?: string | null
          sections?: Json
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          error?: string | null
          generated_at?: string | null
          group_id?: string | null
          id?: string
          is_current?: boolean
          kind?: Database["public"]["Enums"]["report_kind"]
          meeting_id?: string | null
          model?: string | null
          opportunity_id?: string | null
          person_id?: string | null
          sections?: Json
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "reports_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "company_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_ageing"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "reports_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
        ]
      }
      tasks: {
        Row: {
          company_id: string | null
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          meeting_id: string | null
          notes: string | null
          opportunity_id: string | null
          origin: Database["public"]["Enums"]["record_origin"]
          owner: Database["public"]["Enums"]["task_owner"]
          owner_person_id: string | null
          person_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          notes?: string | null
          opportunity_id?: string | null
          origin?: Database["public"]["Enums"]["record_origin"]
          owner?: Database["public"]["Enums"]["task_owner"]
          owner_person_id?: string | null
          person_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          notes?: string | null
          opportunity_id?: string | null
          origin?: Database["public"]["Enums"]["record_origin"]
          owner?: Database["public"]["Enums"]["task_owner"]
          owner_person_id?: string | null
          person_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_coverage"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "tasks_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity_ageing"
            referencedColumns: ["opportunity_id"]
          },
          {
            foreignKeyName: "tasks_owner_person_id_fkey"
            columns: ["owner_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_owner_person_id_fkey"
            columns: ["owner_person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
          {
            foreignKeyName: "tasks_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
        ]
      }
    }
    Views: {
      company_coverage: {
        Row: {
          company_id: string | null
          contact_count: number | null
          furthest_stage:
            | Database["public"]["Enums"]["relationship_stage"]
            | null
          user_id: string | null
        }
        Relationships: []
      }
      opportunity_ageing: {
        Row: {
          days_in_stage: number | null
          days_since_applied: number | null
          last_activity_at: string | null
          opportunity_id: string | null
          user_id: string | null
        }
        Insert: {
          days_in_stage?: never
          days_since_applied?: never
          last_activity_at?: never
          opportunity_id?: string | null
          user_id?: string | null
        }
        Update: {
          days_in_stage?: never
          days_since_applied?: never
          last_activity_at?: never
          opportunity_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      person_last_interaction: {
        Row: {
          last_interaction_at: string | null
          person_id: string | null
          user_id: string | null
        }
        Insert: {
          last_interaction_at?: never
          person_id?: string | null
          user_id?: string | null
        }
        Update: {
          last_interaction_at?: never
          person_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      person_next_follow_up: {
        Row: {
          due_date: string | null
          person_id: string | null
          task_id: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person_last_interaction"
            referencedColumns: ["person_id"]
          },
        ]
      }
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      activity_type:
        | "note"
        | "email_sent"
        | "email_received"
        | "message"
        | "call"
        | "meeting_held"
        | "intro_requested"
        | "intro_offered"
        | "intro_made"
        | "stage_changed"
        | "application_submitted"
        | "document_sent"
        | "opportunity_created"
        | "research_generated"
      company_status: "target" | "active" | "watching" | "paused" | "closed"
      document_kind:
        | "cv"
        | "cover_letter"
        | "job_description"
        | "interview_notes"
        | "company_material"
        | "research"
        | "other"
      insight_category:
        | "advice"
        | "market_intel"
        | "hiring_signal"
        | "company_intel"
        | "personal"
      interaction_direction: "outbound" | "inbound"
      meeting_status: "scheduled" | "completed" | "cancelled"
      meeting_type:
        | "coffee"
        | "call"
        | "video"
        | "office"
        | "event"
        | "interview"
        | "other"
      opportunity_kind: "speculative" | "formal"
      opportunity_outcome:
        | "offer_accepted"
        | "offer_declined"
        | "rejected"
        | "withdrawn"
        | "lapsed"
        | "not_pursued"
      opportunity_person_role:
        | "source"
        | "referrer"
        | "hiring_manager"
        | "interviewer"
        | "contact"
      opportunity_stage:
        | "signal"
        | "exploring"
        | "pursuing"
        | "identified"
        | "preparing"
        | "applied"
        | "assessment"
        | "interviewing"
        | "final_round"
        | "offer"
      opportunity_state: "open" | "closed"
      participant_role: "attendee" | "interviewer" | "organiser"
      person_source:
        | "existing"
        | "introduction"
        | "cold"
        | "event"
        | "alumni"
        | "other"
      priority_level: "high" | "medium" | "low"
      record_origin: "user" | "ai" | "rule" | "system"
      relationship_stage:
        | "identified"
        | "intro_requested"
        | "ready_to_contact"
        | "contacted"
        | "meeting_scheduled"
        | "met"
        | "established"
        | "dormant"
      report_kind:
        | "company_overview"
        | "group_deep_dive"
        | "role_scan"
        | "person_profile"
        | "meeting_brief"
        | "interview_prep"
      report_status: "queued" | "running" | "ready" | "failed"
      task_owner: "me" | "them"
      task_priority: "high" | "normal"
      task_status: "open" | "done" | "cancelled"
      task_type:
        | "todo"
        | "follow_up"
        | "send"
        | "apply"
        | "prepare"
        | "research"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_type: [
        "note",
        "email_sent",
        "email_received",
        "message",
        "call",
        "meeting_held",
        "intro_requested",
        "intro_offered",
        "intro_made",
        "stage_changed",
        "application_submitted",
        "document_sent",
        "opportunity_created",
        "research_generated",
      ],
      company_status: ["target", "active", "watching", "paused", "closed"],
      document_kind: [
        "cv",
        "cover_letter",
        "job_description",
        "interview_notes",
        "company_material",
        "research",
        "other",
      ],
      insight_category: [
        "advice",
        "market_intel",
        "hiring_signal",
        "company_intel",
        "personal",
      ],
      interaction_direction: ["outbound", "inbound"],
      meeting_status: ["scheduled", "completed", "cancelled"],
      meeting_type: [
        "coffee",
        "call",
        "video",
        "office",
        "event",
        "interview",
        "other",
      ],
      opportunity_kind: ["speculative", "formal"],
      opportunity_outcome: [
        "offer_accepted",
        "offer_declined",
        "rejected",
        "withdrawn",
        "lapsed",
        "not_pursued",
      ],
      opportunity_person_role: [
        "source",
        "referrer",
        "hiring_manager",
        "interviewer",
        "contact",
      ],
      opportunity_stage: [
        "signal",
        "exploring",
        "pursuing",
        "identified",
        "preparing",
        "applied",
        "assessment",
        "interviewing",
        "final_round",
        "offer",
      ],
      opportunity_state: ["open", "closed"],
      participant_role: ["attendee", "interviewer", "organiser"],
      person_source: [
        "existing",
        "introduction",
        "cold",
        "event",
        "alumni",
        "other",
      ],
      priority_level: ["high", "medium", "low"],
      record_origin: ["user", "ai", "rule", "system"],
      relationship_stage: [
        "identified",
        "intro_requested",
        "ready_to_contact",
        "contacted",
        "meeting_scheduled",
        "met",
        "established",
        "dormant",
      ],
      report_kind: [
        "company_overview",
        "group_deep_dive",
        "role_scan",
        "person_profile",
        "meeting_brief",
        "interview_prep",
      ],
      report_status: ["queued", "running", "ready", "failed"],
      task_owner: ["me", "them"],
      task_priority: ["high", "normal"],
      task_status: ["open", "done", "cancelled"],
      task_type: ["todo", "follow_up", "send", "apply", "prepare", "research"],
    },
  },
} as const
