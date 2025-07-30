import React from 'react';
import { Database, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface SupabaseSetupProps {
  onClose: () => void;
}

export default function SupabaseSetup({ onClose }: SupabaseSetupProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Supabase Setup Required</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Invalid Supabase Configuration</h3>
                <p className="text-amber-700">
                  The Supabase API key in your .env file is invalid or incorrect. 
                  Please follow the steps below to get the correct credentials from your Supabase project.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Supabase Project</h3>
                <p className="text-gray-600 mb-3">
                  Go to Supabase and create a new project if you haven't already.
                </p>
                <a
                  <span>Open Supabase Dashboard</span>
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                2
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure Authentication</h3>
              <div className="flex-1">
                    In your Supabase dashboard, go to Authentication → Settings and:
                  From your Supabase project dashboard, go to Settings → API to find:
                </p>
                    <li><strong>Enable Email authentication</strong></li>
                    <li><strong>Disable email confirmation</strong> for faster testing (optional)</li>
                    <li><strong>Set up email templates</strong> if you want custom emails</li>
                  <li><strong>Anon Key:</strong> Found in "Project API keys" section</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Up Database Tables</h3>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Environment Variables</h3>
                    The application will automatically create the required database tables:
                  Update your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file with your Supabase credentials:
                </p>
                    <li><strong>generated_images:</strong> Stores AI-generated images</li>
                    <li><strong>auth.users:</strong> Managed by Supabase Auth (automatic)</li>
                    <li><strong>Storage bucket:</strong> For storing generated images</li>
                    <div>VITE_SUPABASE_URL=https://your-project-id.supabase.co</div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Run Database Migrations</h3>
                <p className="text-gray-600 mb-3">
                  The database schema will be automatically created when you first use the application.
                  Make sure your Supabase project has the following tables:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>generated_images:</strong> Stores AI-generated images</li>
                  <li><strong>auth.users:</strong> Managed by Supabase Auth (automatic)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure Authentication</h3>
                <p className="text-gray-600 mb-3">
                  In your Supabase dashboard, go to Authentication → Providers and:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Enable Email authentication</li>
                  <li><strong>Enable Google OAuth:</strong> Toggle on Google provider and configure OAuth credentials</li>
                  <li>Configure redirect URLs for your domain</li>
                </ul>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    will automatically connect to your Supabase project. Users will be able to create accounts
                    with email/password authentication and their generated images will be stored securely.
                  </p>
                  <ol className="text-amber-700 text-sm mt-2 space-y-1 list-decimal list-inside">
                    <li>Go to Authentication → Providers in your Supabase dashboard</li>
                    <li>Enable the Google provider</li>
                    <li>Add your Google OAuth Client ID and Secret</li>
                    <li>Configure authorized redirect URIs</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">After Setup</h3>
                <p className="text-green-700">
                  Once you've completed these steps, restart your development server and the application 
                  will automatically connect to your Supabase project. Users will be able to sign up, 
                  sign in, and their generated images will be stored in your database.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
            >
              I'll Set This Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  );
}