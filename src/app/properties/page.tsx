import PropertyForm from '@/app/components/PropertyForm';
import PropertyAdmin from '../components/PropertyAdmin';


const PropertyPage: React.FC = () => {
  return (
    <div>
      <PropertyForm />
      <PropertyAdmin/>
    </div>
  );
};

export default PropertyPage;
