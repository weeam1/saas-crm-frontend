import { useNavigate } from 'react-router-dom';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import CallHistory from './callHistory';
const SipHistory = () => {
    const navigate = useNavigate();
    return (
        <div>
            <AppButton
                ml='2'
                leftIcon={<IoArrowBack />}
                onClick={() => navigate('/sip')}
            >
                Back
            </AppButton>
            <CallHistory/>
        </div>
    );
}

export default SipHistory;