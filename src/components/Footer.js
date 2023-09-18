const style = {
    backgroundColor: '#3182CE',
    borderTop: '1px solid #E7E7E7',
    textAlign: 'center',
    padding: '20px',
    position: 'fixed',
    left: '0',
    bottom: '0',
    height: '60px',
    width: '100%',
    color: '#FFFFFF',
};

const phantom = {
    display: 'block',
    padding: '20px',
    height: '60px',
    width: '100%',
};

function Footer() {
    return (
        <div>
            <div style={phantom} />
            <div style={style}>Created by WeDAA</div>
        </div>
    );
}

export default Footer;
