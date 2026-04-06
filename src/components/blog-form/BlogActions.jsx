import { CheckCircle2 } from 'lucide-react';

const BlogActions = ({ handleSave, isFormValid }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
                type="button"
                onClick={() => handleSave('Draft')}
                disabled={!isFormValid}
                className="w-full sm:w-auto flex items-center justify-center px-12 py-4 bg-white border border-slate-200 rounded-3xl text-base font-bold text-slate-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:grayscale"
            >
                Save as Draft
            </button>
            <button
                type="button"
                onClick={() => handleSave('Published')}
                disabled={!isFormValid}
                className="w-full sm:w-auto flex items-center justify-center px-12 py-4 bg-primary rounded-3xl text-base font-bold text-white hover:bg-primary-dark transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:grayscale"
            >
                <CheckCircle2 size={18} className="mr-2 text-white" />
                Publish Article
            </button>
        </div>
    );
};

export default BlogActions;
