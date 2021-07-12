import styled from "styled-components";

export const EmployeeContainer = styled.div`
  height: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #2c2c2c;

  @media screen and (max-width: 768px) {
    height: 1100px;
  }

  @media screen and (max-width: 480px) {
    height: 1300px;
  }
`;

export const EmployeeWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  grid-gap: 16px;
  padding: 0 50px;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
`;

export const EmployeeCard = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  max-height: 340px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
`;

export const EmployeeIcon = styled.img`
  height: 160px;
  width: 160px;
  margin-bottom: 10px;
`;

export const EmployeeH1 = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 200px;
  display: flex;
  justify-content: center;
  align-items: left;

  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const EmployeeH2 = styled.h2`
  font-size: 1rem;
  margin-bottom: 10px;
`;
export const EmployeeH3 = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 5px;
  margin-left: -25px;
`;
export const EmployeeP = styled.p`
  font-size: 1rem;
  text-align: center;
`;
export const FormWrap = styled.div`
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 400px) {
    height: 80%;
  }
`;

export const FormContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 480px) {
    padding: 10px;
  }
`;
export const Form = styled.form`
  background: #3d3d3d;
  max-width: 500px;
  width: 100%;
  z-index: 1;
  display: grid;
  margin: 0 auto;
  margin-top: 30px;
  padding: 50px 250px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

  @media screen and (max-width: 400px) {
    padding: 32px 32px;
  }
`;
export const FormLittle = styled.form`
  background: #14cca4;
  max-width: 500px;
  width: 50%;
  z-index: 2;
  display: grid;
  margin-top: -10px;
  margin-left: -130px;
  padding: 20px 40px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

  @media screen and (max-width: 400px) {
    padding: 32px 32px;
  }
`;
