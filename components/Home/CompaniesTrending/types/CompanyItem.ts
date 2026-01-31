type CompanyType = {
   id: string;
   profile: {
      name: string;
      photo: string;
   };

   minor_price?: number;
   minor_price_currency?: string;
};

export default CompanyType;
