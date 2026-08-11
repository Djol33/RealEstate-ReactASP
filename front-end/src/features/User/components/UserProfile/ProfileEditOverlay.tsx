import { Overlay } from '../../../../shared/components/Overlay/Overlay';
import { EditProfileForm } from '../EditProfileForm';
import { EditCompanyForm } from '../EditCompanyForm/EditCompanyForm';

interface ProfileEditOverlayProps {
  isVisible: boolean;
  onClose: (visible: boolean) => void;
  basic: { firstName: string; lastName: string } | null;
  company: { name: string; bip: string; logo: string | null } | null;
  onSaved: () => void;
}

export function ProfileEditOverlay({ isVisible, onClose, basic, company, onSaved }: ProfileEditOverlayProps) {
  return (
    <Overlay isVisible={isVisible} changeVisibility={onClose}>
      {company ? (
        <EditCompanyForm initialData={company} onSaved={onSaved} onCancel={() => onClose(false)} />
      ) : basic ? (
        <EditProfileForm initialData={basic} onSaved={onSaved} onCancel={() => onClose(false)} />
      ) : null}
    </Overlay>
  );
}
