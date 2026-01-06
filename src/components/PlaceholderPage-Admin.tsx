import Layout from "./Layout";
import { AlertCircle } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <Layout title={title}>
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 md:p-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-block p-4 bg-blue-100 rounded-lg mb-6">
            <AlertCircle size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            {description ||
              "This section is being developed. Please check back soon."}
          </p>
          <p className="text-sm text-gray-500 mb-8">
            This page is ready for implementation. Continue chatting with the
            assistant to request the specific features and functionality you
            need for this section.
          </p>
          <button className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Request This Feature
          </button>
        </div>
      </div>
    </Layout>
  );
}
