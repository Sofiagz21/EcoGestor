export default function IdResiduosPage({ params }: { params: { id: string } }) {

    const IdResiduo = params.id;

    return <p>{IdResiduo}</p>;
}