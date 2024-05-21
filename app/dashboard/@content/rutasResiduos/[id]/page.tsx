export default function IdRutaResiduoPage({ params }: { params: { id: string } }) {

    const IdRutaResiduo = params.id;

    return <p>{IdRutaResiduo}</p>;
}