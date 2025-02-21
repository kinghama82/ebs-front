"use client"

import React from 'react';
import styled from 'styled-components';

const BasicMenu = () => {
  return (
    <StyledWrapper>
      <div className="tab-container">
        <input type="radio" name="tab" id="tab1" className="tab tab--1" />
        <label className="tab_label" htmlFor="tab1">뉴스</label>
        <input type="radio" name="tab" id="tab2" className="tab tab--2" />
        <label className="tab_label" htmlFor="tab2">자유</label>
        <input type="radio" name="tab" id="tab3" className="tab tab--3" />
        <label className="tab_label" htmlFor="tab3">질문</label>
        <div className="indicator" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .component-title {
    width: 100%;
    position: absolute;
    z-index: 999;
    top: 30px;
    left: 0;
    padding: 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #888;
    text-align: center;
  }

  .tab-container {
    position: relative;

    display: flex;
    flex-direction: row;
    align-items: flex-start;

    padding: 2px;

    background-color: #dadadb;
    border-radius: 9px;
  }

  .indicator {
    content: "";
    width: 130px;
    height: 28px;
    background: #ffffff;
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 9;
    border: 0.5px solid rgba(0, 0, 0, 0.04);
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.12), 0px 3px 1px rgba(0, 0, 0, 0.04);
    border-radius: 7px;
    transition: all 0.2s ease-out;
  }

  .tab {
    width: 130px;
    height: 28px;
    position: absolute;
    z-index: 99;
    outline: none;
    opacity: 0;
  }

  .tab_label {
    width: 130px;
    height: 28px;

    position: relative;
    z-index: 999;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 0;

    font-size: 0.75rem;
    opacity: 0.6;

    cursor: pointer;
  }

  .tab--1:checked ~ .indicator {
    left: 2px;
  }

  .tab--2:checked ~ .indicator {
    left: calc(130px + 2px);
  }

  .tab--3:checked ~ .indicator {
    left: calc(130px * 2 + 2px);
  }`;

export default BasicMenu;
