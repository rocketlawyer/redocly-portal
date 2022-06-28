import * as React from 'react';
import styled from 'styled-components';

import { Flex, Link } from '@redocly/developer-portal/ui';

export default function Footer(props) {
  const { columns } = props.footer;

  return (
    <FooterWrapper>
      <Flex py="30px" justifyContent="center">
        <FooterItems>
          {
            columns.map((col, index) => {
              return <li key={index}>

                <FooterItems>
                  {
                    col.items.map((item, index) => {
                      return <li key={index}>
                        <Link to={item.link} style={{ textDecoration: 'none' }}>{item.label}</Link>
                      </li>
                    })
                  }
                </FooterItems>
              </li>
            })
          }
        </FooterItems>
      </Flex>
    </FooterWrapper>
  )
}

const FooterWrapper = styled.div`
    justify-content:center;
    background: #990000;
`;

const FooterItems = styled.ul`
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    color: #ffffff;
    justify-content: start;
    & li {
        list-style: none;
        margin-right: 20px;
        & a {
            color: #ffffff;
        }
    }
`;