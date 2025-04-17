
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, RefreshCw } from "lucide-react";
import { generatePassword } from "@/utils/passwordGenerator";

interface PasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PasswordData) => void;
  initialData?: PasswordData;
  isEditing: boolean;
}

export interface PasswordData {
  id?: string;
  title: string;
  username: string;
  password: string;
  url?: string; // Changed from required to optional
  notes?: string;
}

const PasswordForm = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing,
}: PasswordFormProps) => {
  const [formData, setFormData] = useState<PasswordData>({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Calculate initial password strength
      calculatePasswordStrength(initialData.password);
    } else {
      setFormData({
        title: "",
        username: "",
        password: "",
        url: "",
        notes: "",
      });
      setPasswordStrength(0);
      setPasswordFeedback("");
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    // Simple password strength algorithm
    let strength = 0;
    
    // Length check
    if (password.length > 8) strength += 1;
    if (password.length > 12) strength += 1;
    
    // Character variety check
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Set strength (0-5)
    setPasswordStrength(Math.min(5, strength));
    
    // Set feedback
    if (strength === 0) setPasswordFeedback("Very weak");
    else if (strength === 1) setPasswordFeedback("Weak");
    else if (strength === 2) setPasswordFeedback("Fair");
    else if (strength === 3) setPasswordFeedback("Good");
    else if (strength === 4) setPasswordFeedback("Strong");
    else setPasswordFeedback("Very strong");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(16, true, true, true);
    setFormData((prev) => ({
      ...prev,
      password: newPassword,
    }));
    calculatePasswordStrength(newPassword);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-400";
      case 5:
        return "bg-green-600";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-gray-200 border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">
            {isEditing ? "Edit password" : "Add new password"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isEditing
              ? "Update your saved password details."
              : "Add a new password to your vault."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/** Input fields below */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-gray-300">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3 bg-gray-800 text-gray-100 border-gray-700 placeholder:text-gray-500"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right text-gray-300">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="col-span-3 bg-gray-800 text-gray-100 border-gray-700 placeholder:text-gray-500"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right text-gray-300">Password</Label>
              <div className="col-span-3 flex">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="pr-10 bg-gray-800 text-gray-100 border-gray-700 placeholder:text-gray-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="ml-2 border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={handleGeneratePassword}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Generate password</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-sm text-gray-400">Strength</div>
              <div className="col-span-3">
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()}`}
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400">{passwordFeedback}</span>
                  {passwordStrength < 3 && formData.password && (
                    <div className="flex items-center text-xs text-yellow-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Consider a stronger password
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right text-gray-300">Website URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://"
                className="col-span-3 bg-gray-800 text-gray-100 border-gray-700 placeholder:text-gray-500"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right text-gray-300">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                className="col-span-3 bg-gray-800 text-gray-100 border-gray-700 placeholder:text-gray-500"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {isEditing ? "Save changes" : "Add entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

    </Dialog>
  );
};

export default PasswordForm;
