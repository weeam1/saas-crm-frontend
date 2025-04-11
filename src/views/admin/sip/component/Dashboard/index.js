import { useNavigate } from 'react-router-dom';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import TotalTimeCallsRecordGraph from './TotalTimeCallsRecordGraph';
import JoinedVsMadeCallGraph from './JoinedVsMadeCallGraph';
const SipDashboard = () => {
    const navigate = useNavigate();
    return (
        <>
            <AppButton
                ml='2'
                leftIcon={<IoArrowBack />}
                onClick={() => navigate('/sip')}
            >
                Back
            </AppButton>
            <TotalTimeCallsRecordGraph/>
            <JoinedVsMadeCallGraph/>
        </>
    );
}

export default SipDashboard;