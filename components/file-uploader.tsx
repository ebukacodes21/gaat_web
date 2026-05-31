import { FC } from "react";
import { ClipLoader } from "react-spinners";

export const FileUpload: FC<{
  title: string;
  text_color?: string
  onChange: (file: File) => void;
  isLoading: boolean;
}> = ({ title, onChange, isLoading, text_color }) => {
  return (
    <div>
      <p className={`text-start ${text_color} font-semibold text-sm`}>{title}</p>
      <input
        type="file"
        accept="image/jpeg, image/png, application/pdf"
        className={`w-full border ${text_color} border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
        disabled={isLoading}
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : undefined;
          if (file) {
            onChange(file);
          }
        }}
      />
      {isLoading && (
        <div className="flex items-center gpa-2">
          <p className={`${text_color} mt-2`}>file uploading...</p>
          <ClipLoader loading={isLoading} color={"white"} size={20} />
        </div>
      )}
    </div>
  );
};